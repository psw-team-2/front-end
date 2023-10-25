export interface User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    email: string;
}

enum UserRole
{
    Administrator,
    Author,
    Tourist
}