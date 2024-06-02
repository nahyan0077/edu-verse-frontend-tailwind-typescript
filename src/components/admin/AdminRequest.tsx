import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch } from "@/hooks/hooks";
import LoadingPopUp from "../common/skeleton/LoadingPopUp";
import { getAllInstructorsAction } from "@/redux/store/actions/user";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import DownloadIcon from '@mui/icons-material/Download';


interface InstructorRequest {
	_id: string;
	userName: string;
	createdAt: string;
	isVerified: boolean;
	cvUrl: string;
}

export const AdminRequests: React.FC = () => {
	const dispatch = useAppDispatch();
	const [requests, setRequests] = useState<InstructorRequest[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		const fetchInstructors = async () => {
			try {
				const resultAction = await dispatch(
					getAllInstructorsAction({ page: 1, limit: 10 })
				);
				console.log(resultAction, "aciton result get instr");

				if (getAllInstructorsAction.fulfilled.match(resultAction)) {
					setRequests(resultAction.payload.data);
				} else {
					setError("Failed to fetch instructors");
				}
			} catch (err) {
				setError("An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchInstructors();
	}, [dispatch]);

	if (loading) {
		return <LoadingPopUp isLoading={loading} />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

    const handleDelete = async () => {

		

		console.log("Item deleted");
		setModalVisible(false);


	};

	const handleCancel = () => {
		console.log("Action cancelled");
		setModalVisible(false);
	};

	const handleVerify = async () => {
		setModalVisible(true);
	};

	const downloadCV = (cvUrl: string) => {
		// Implement download logic here, such as opening the CV in a new tab
		window.open(cvUrl, "_blank");
	};

	return (
		<div className="overflow-x-auto max-w-full mx-auto p-8">
            			{isModalVisible && (
				<ConfirmModal
					message="verfiy the instructor"
					onConfirm={handleDelete}
					onCancel={handleCancel}
				/>
			)}
            <h1 className="text-3xl font-bold ml-10 mb-10" >Requests</h1>
			<table className="table table-lg">
				<thead className="text-lg uppercase text-center">
					<tr>
						<th>Si.No</th>
						<th>Name</th>
						<th>Applied Date</th>
						<th>CV</th>
						<th>Verify</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{requests.map((request, index) => (
						<tr key={request._id} className="hover:bg-gray-800">
							<th>{index + 1}</th>
							<td>{request.userName}</td>
							<td>{format(new Date(request.createdAt), "dd-MM-yyyy")}</td>
							<td>
								<button className="btn btn-outline btn-info btn-sm" onClick={() => downloadCV(request.cvUrl)}>
									CV <DownloadIcon fontSize="small" />
								</button>
							</td>
							<td>
								{request.isVerified ? (
									<DoneOutlineIcon color="success" />
								) : (
									<button onClick={ handleVerify } className="btn btn-outline btn-success btn-sm ">
										{" "}
										Verify{" "}
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
