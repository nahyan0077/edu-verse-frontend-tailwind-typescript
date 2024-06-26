enum Role {
    pending='pending',
    student='student',
    teacher='instructor',
    admin='admin'
}

enum Gender {
    male = 'male',
    female = 'female',
    other = 'other'
}

enum Profession {
    student = 'student',
    working = 'working'
}

interface Contact {
    phone?: string,
    social?: string,
    address?: string
}

interface Profile {
    avatar?: string,
    dateOfBirth?: string,
    gender?: Gender
}



export interface SignupFormData {
    _id?: string, 
    email?: string,
    password?: string,
    confirmPassword?: string
    firstName?: string,
    lastName?: string,
    userName?: string,
    profile?: Profile,
    contact?: Contact,
    profession?: Profession,
    qualification?: string,
    role?: Role,
    profit?: string,
    isGAuth?: boolean,
    cv?:string,
    isVerified?: boolean,
    isRejected?: boolean,
    isRequested?: boolean,
    isBlocked?: boolean,
    lastLoginDate?: Date;
    loginStreak?: number;
    weeklyLogins?: boolean[];
}

export interface LoginFormData {
    email: string,
    password: string
}