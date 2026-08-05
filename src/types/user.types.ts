export interface LoggedInUser {
    id: number;
    name: string;
    email: string;
    createdDate: string;
}

export interface User {
    id: number;
    username: string;
    mobile: string;
    email: string;
    name: string;
    orgId: number;
    createdDate: string;
    enabled: boolean;
    member: boolean;
}