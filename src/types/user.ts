export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  label?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  role: UserRole;
  emailVerified?: string | null;
  createdAt: string;
}
