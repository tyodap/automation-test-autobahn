import { Organization } from "../interfaces/organization.interface";

export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  mailosaur_server: string;
  password: string;
  uid: string;
  orgs: Organization[];
  role: ["Owner" | "admin" | "General user"];
  tokenLink: string;
  otpSecret: string;
  initial: string;
}
