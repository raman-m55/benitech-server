import jwt from 'jsonwebtoken';

export const encodeToken = (payload: any) => {
  const secret = process.env.SECRET_JWT;
  if (!secret) throw new Error('secret jwt is null');
  const token = jwt.sign(payload, secret, { expiresIn: '1d' });
  return token;
};

export const decodeToken = (token: string) => {
  const secret = process.env.SECRET_JWT;
  if (!secret) throw new Error('secret jwt is null');
  return jwt.verify(token, secret);
};
