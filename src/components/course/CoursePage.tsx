import { useAppDispatch } from "@/hooks/hooks";
import { getActiveCoursesAction } from "@/redux/store/actions/course";
import { Lesson } from "@/types/ICourse";
import React, { useEffect, useState } from "react";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ui/theme-provider";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CurrencyRupee as CurrencyRupeeIcon } from '@mui/icons-material';

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let result = '';

    if (h > 0) {
        result += `${h}hr${h > 1 ? 's' : ''} `;
    }
    if (m > 0) {
        result += `${m}min${m > 1 ? 's' : ''} `;
    }
    if (s > 0 || (h === 0 && m === 0)) {
        result += `${s}sec${s > 1 ? 's' : ''}`;
    }

    return result.trim();
};

export const CoursePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [courses, setCourses] = useState<any[]>([]);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const categoryData = useSelector((state: RootState) => state.category);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

    const levels = ['beginner', 'intermediate', 'expert']

    useEffect(() => {
        fetchCourse();
    }, [dispatch]);

    const fetchCourse = async () => {
        const courses = await dispatch(getActiveCoursesAction({ page: 1, limit: 2 }));
        if (getActiveCoursesAction.fulfilled.match(courses)) {
            setCourses(courses.payload.data);
            console.log("Fetched courses:", courses);
        } else {
            console.error("Failed to fetch courses:", courses.payload);
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories(prevCategories =>
            prevCategories.includes(categoryId)
                ? prevCategories.filter(id => id !== categoryId)
                : [...prevCategories, categoryId]
        );
    };

    const handleLevelChange = (level: string) => {
        setSelectedLevels(prevLevels =>
            prevLevels.includes(level)
                ? prevLevels.filter(lvl => lvl !== level)
                : [...prevLevels, level]
        );
    };

    const handlePriceChange = (price: string) => {
        setSelectedPrices(prevPrices =>
            prevPrices.includes(price)
                ? prevPrices.filter(prc => prc !== price)
                : [...prevPrices, price]
        );
    };

    const filterCourses = (courses: any[]) => {    
        return courses.filter(course =>
            (!selectedCategories.length || selectedCategories.includes(course.categoryRef._id)) &&
            (!selectedLevels.length || selectedLevels.includes(course.level)) &&
            (!selectedPrices.length || selectedPrices.includes(course.pricing.type))
        );
    };

    const calculateTotalDuration = (lessons: Lesson[]) => {
        return lessons
            .filter(lesson => lesson.duration !== undefined)
            .reduce((total, lesson) => total + parseFloat(lesson.duration!), 0);
    };

    return (
        <div className={`max-w-full mx-auto py-10 px-4 lg:px-24 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-lg font-medium">Showing 1-9 of 21 courses</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5">
                <div className="w-full md:w-1/4 p-5 rounded-xl shadow-xl py-10 bg-gray-200 dark:bg-gray-800">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search Course"
                            className="input input-bordered w-full bg-gray-300 dark:bg-gray-700"
                        />
                    </div>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Course Categories</h3>
                        <div className="flex flex-col space-y-2">
                            {categoryData?.data.map((data) => (
                                <label key={data._id}>
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedCategories.includes(data._id)}
                                        onChange={() => handleCategoryChange(data._id)}
                                    /> {data?.categoryName}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Level</h3>
                        <div className="flex flex-col space-y-2">
                            {levels.map((lvl) => (
                                <label key={lvl}>
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedLevels.includes(lvl)}
                                        onChange={() => handleLevelChange(lvl)}
                                    /> {lvl}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Price</h3>
                        <div className="flex flex-col space-y-2">
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedPrices.includes('free')}
                                    onChange={() => handlePriceChange('free')}
                                /> Free
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedPrices.includes('paid')}
                                    onChange={() => handlePriceChange('paid')}
                                /> Paid
                            </label>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterCourses(courses ?? []).map((course) => {
                        const totalDurationSeconds = calculateTotalDuration(course.lessons ?? []);
                        const formattedDuration = formatDuration(totalDurationSeconds);

                        return (
                            <motion.div
                                key={course._id}
                                className="card shadow-xl transition-transform transform hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                            >
                                <figure onClick={() => navigate('/single-course', { state: { course: { ...course, duration: formattedDuration } } })}>
                                    <motion.img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                        whileHover={{ scale: 1.1 }}
                                    />
                                </figure>
                                <div className="card-body p-4">
                                    <h2 className="card-title text-lg font-semibold mb-2">{course.title}</h2>
                                    <p className="text-sm text-gray-500 flex items-center mb-2">
                                        <div className="avatar mr-2">
                                            <div className="w-6 rounded-full">
                                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Instructor" />
                                            </div>
                                        </div>
                                        Instructor: {course?.instructorRef?.firstName}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center mb-2">
                                        <AutoStoriesIcon color="secondary" fontSize="small" className="mr-1" />
                                        Lessons: <span className="font-bold ml-1">{course.lessons?.length}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center mb-2">
                                        <AccessTimeIcon color="warning" fontSize="small" className="mr-1" />
                                        Duration: <span className="font-bold ml-1">{formattedDuration}</span>
                                    </p>
                                    <p className="text-lg font-bold text-gray-800 mb-2">
                                        {course.pricing?.type ? (
                                            <>
                                                <span className="line-through mr-2">{course.pricing.discountedAmount}</span>
                                                <span className="text-red-500"><CurrencyRupeeIcon fontSize="small" />  {course.pricing.amount}</span>
                                            </>
                                        ) : (
                                            course.pricing?.amount
                                        )}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <div>
                                            {course.level === 'beginner' && (
                                                <span className="text-sm text-green-500">⭐ {course.level}</span>
                                            )}
                                            {course.level === 'intermediate' && (
                                                <span className="text-sm text-yellow-500">⭐ {course.level}</span>
                                            )}
                                            {course.level === 'expert' && (
                                                <span className="text-sm text-red-500">⭐ {course.level}</span>
                                            )}
                                        </div>
                                        <button className="btn btn-primary btn-outline btn-sm">Buy Now</button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <div className="btn-group">
                    <button className="btn">1</button>
                    <button className="btn btn-outline">2</button>
                    <button className="btn btn-outline">3</button>
                </div>
            </div>
        </div>
    );
};