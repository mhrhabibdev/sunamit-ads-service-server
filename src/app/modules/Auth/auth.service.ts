import status from 'http-status';

import bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';
import { generateToken, verifyToken } from './auth.utils';
import config from '../../config';
import sendEmail from '../../utils/sendEmail';


const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(status.UNAUTHORIZED, 'This user is not exist');
  }

  const isCurrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCurrectPassword) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid email or password');
  }

  const jwtPayload = {
    email: userData.email,
    id: userData.id,
    role: userData.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.JWT.JWT_REFRESH_SECRET as string);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError(status.UNAUTHORIZED, 'You are not autherized!');
  }

  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    email: isUserExists?.email,
    id: isUserExists?.id,
    role: isUserExists?.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  return { accessToken };
};

const changePassword = async (user: JwtPayload, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCurrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCurrectPassword) {
    throw new AppError(status.UNAUTHORIZED, 'Your Password is Wrong!');
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return;
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirst({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('user data', userData);

  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'Invalid email id');
  }

  const jwtPayload = {
    email: userData?.email,
    id: userData?.id,
    role: userData?.role,
  };

  const resetPasswordToken = generateToken(
    jwtPayload,
    config.JWT.JWT_RESET_PASSWORD_SECRET as string,
    config.JWT.JWT_RESET_PASSWORD_EXPIRES_IN,
  );

  const resetPasswordLink =
    config.RESET_PASSWORD_LINK +
    `?userId=${userData.id}&token=${resetPasswordToken}`;

const html = `
<div style="font-family: 'Poppins', Arial, sans-serif; max-inline-size: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <!-- Header with Sunam IT branding -->
  <div style="background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%); padding: 25px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 600;">Sunam IT Ads Service</h1>
    <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Powering Your Digital Advertising</p>
  </div>

  <!-- Main Content -->
  <div style="padding: 30px;">
    <h2 style="color: #333333; margin-block-start: 0; font-size: 20px;">Password Reset Request</h2>
    
    <p style="color: #555555; line-height: 1.6;">Dear ${userData?.name || "User"
    },</p>
    
    <p style="color: #555555; line-height: 1.6;">We received a request to reset your password for your <strong>Sunam IT Ads Service</strong> account.</p>
    
    <!-- Main Action Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetPasswordLink}" 
         style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; box-shadow: 0 4px 8px rgba(110, 72, 170, 0.3);">
        Reset Password Now
      </a>
    </div>
    
    <p style="color: #777777; font-size: 14px; line-height: 1.5;">
      <strong>Note:</strong> This password reset link will expire in <strong style="color: #6e48aa;">15 minutes</strong>.
      If you didn't request this change, please secure your account by contacting our support team immediately.
    </p>
  </div>

  <!-- Footer -->
  <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-block-start: 1px solid #eeeeee;">
    <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} Sunam IT Ads Service. All rights reserved.</p>
    <p style="margin: 5px 0;">
      <a href="https://sunamit.com" style="color: #6e48aa; text-decoration: none; margin: 0 8px;">Our Website</a>
      <a href="https://sunamit.com/contact" style="color: #6e48aa; text-decoration: none; margin: 0 8px;">Contact Support</a>
      <a href="https://sunamit.com/privacy" style="color: #6e48aa; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
    </p>
    <p style="margin: 5px 0 0; font-size: 11px;">
      Sunam IT Solutions, 123 Tech Park Road, Sunamganj, Bangladesh
    </p>
  </div>
</div>
`;

  await sendEmail(userData?.email, html);
};

const resetPassword = async (
  token: string,
  payload: { email: string; password: string },
) => {
  const userData = await prisma.user.findFirst({
    where: {
      email: payload?.email, //there i chaged 
      status: UserStatus.ACTIVE,
    },
  });
console.log('user data', userData);
  if (!userData) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const isValidToken = verifyToken(
    token,
    config.JWT.JWT_RESET_PASSWORD_SECRET as string,
  );

  if (!isValidToken) {
    throw new AppError(status.FORBIDDEN, 'Invalid token');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  await prisma.user.update({
    where: {
      email: userData?.email, //there i chaged 
    },
    data: {
      password: hashedPassword,
    },
  });

  return;
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
