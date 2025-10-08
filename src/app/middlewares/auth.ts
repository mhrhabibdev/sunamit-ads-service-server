// middlewares/auth.ts
import { UserStatus, UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import { Secret } from 'jsonwebtoken';
import prisma from '../shared/prisma';
import AppError from '../error/AppError';

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
      }

      const verifyUser = verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as Secret,
      );

      // Validate user structure
      if (!verifyUser.id || !verifyUser.email || !verifyUser.role) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid token payload!');
      }

      req.user = {
        id: verifyUser.id,
        email: verifyUser.email,
        role: verifyUser.role,
      };

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
      }

      const userData = await prisma.user.findUnique({
        where: {
          email: verifyUser.email,
          status: UserStatus.ACTIVE,
        },
      });

      if (!userData) {
        throw new AppError(status.NOT_FOUND, 'User is Not Found!');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;