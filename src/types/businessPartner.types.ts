export interface BusinessPartner {
  cardCode: string;
  cardName: string;
  cardType: string;
  address: string;
  city: string;
  country: string;
  county: string;
  zipCode: string;
  cellular: string;
  emailAddress: string | null;
  createDate: string;
  creditLimit: number;
}