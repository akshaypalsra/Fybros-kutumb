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

export type LoggedInUser = Pick<User, "id" | "name" | "email" | "createdDate">;