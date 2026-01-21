import { Role } from "./Role.model";

export interface UserProfile {
  address: string;
  birthDate: string;
  profileImageUrl: string;
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  password?: string;
  profile: UserProfile;
};
