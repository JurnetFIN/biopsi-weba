import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    entraUserUuid: string;
    isBiopsiHato: boolean;
    isBiopsiMember: boolean;
    username: string;
    tokenVersion: number;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** Present and true only on dev mock tokens. Rejected in production session callback. */
    devOnly?: boolean;
  }
}
