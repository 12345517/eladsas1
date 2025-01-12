export interface User {
  id: number,
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isApproved: boolean;
  points: number;
}

