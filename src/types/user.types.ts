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

export interface LoggedInUser {
  id: number;
  title: string;
  name: string;
  cardName: string;
  childCardCodes: string[];
  email: string;
  phone: string | null;
  crCode: string;
  fatherCard: string | null;
  address: string | null;
  role: string;
  active: boolean;
  showCreditLimit: boolean;
}