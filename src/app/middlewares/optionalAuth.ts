// middlewares/optionalAuth.ts
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import { Secret } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization;
    // console.log(token,'token');
    
    if (token) {
      try {
        const decoded = verifyToken(
          token,
          config.JWT.JWT_ACCESS_SECRET as Secret,
        );

        // Validate decoded token structure
        if (decoded && typeof decoded === 'object' && 'id' in decoded && 'email' in decoded && 'role' in decoded) {
          req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role as UserRole,
          };
        } else {
          req.user = undefined;
        }
      } catch (error) {
        // Token is invalid, proceed as guest
        req.user = undefined;
      }
      // console.log(req.user,'fdfdf');
    } else {
      // No token provided, proceed as guest
      req.user = undefined;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};


export default optionalAuth;