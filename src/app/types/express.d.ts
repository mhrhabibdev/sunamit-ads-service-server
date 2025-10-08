// types/express.d.ts
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};