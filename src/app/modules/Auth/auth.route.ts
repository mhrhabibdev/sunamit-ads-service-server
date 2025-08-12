import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { UserRole } from '@prisma/client';
import { validationRequest } from '../../middlewares/validationRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';


const router = Router();

router.post(
  '/login',
  validationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post('/refresh-token', AuthControllers.refreshToken);

router.post(
  '/change-password',
  validationRequest(AuthValidation.passwordChangeSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  AuthControllers.changePassword,
);

router.post('/forgot-password', AuthControllers.forgotPassword);

router.post('/reset-password', AuthControllers.resetPassword);

export const AuthRoutes = router;
