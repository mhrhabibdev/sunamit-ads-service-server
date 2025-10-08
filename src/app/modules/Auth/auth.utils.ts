// modules/Auth/auth.utils.ts
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// ✅ id সহ payload type definition
interface TokenPayload {
  email: string;
  id: string;
  role: string;
}

export const generateToken = (
  payload: TokenPayload, // ✅ এখন id সহ
  secret: Secret,
  expiresIn: any,
) => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  console.log("🔐 Verified Token Payload:", decoded); // Debugging
  return decoded;
};