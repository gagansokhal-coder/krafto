/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  }
}
