export interface User {
    id: string;
    email: string;
    fullName?: string;
    createdAt: Date;
    emailVerifiedAt?: Date;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
}
  