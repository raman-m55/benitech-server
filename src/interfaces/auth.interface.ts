export interface CheckCode {
  _id: string;
  code: number;
  email: string;
  is_used: boolean;
  expired: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
