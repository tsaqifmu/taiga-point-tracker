export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  photo: string | null;
  roles: string[];
}
