import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {UserIdWithToken} from '../interfaces/User';

export default async (req: Request) => {
  console.log(req.headers.authorization);
  const bearer = req.headers.authorization;
  
  if (!bearer) {
    return {
      id: '',
      token: '',
      role: '',
    };
  }

  const token = bearer.split(' ')[1];
  if (!token) {
    return {
      id: '',
      token: '',
      role: '',
    };
  }
  console.log(process.env.JWT_SECRET);
  try {
    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserIdWithToken;
    userFromToken.token = token;
    console.log("authenticate.ts from line 32",userFromToken);
    return userFromToken;
  } catch (error:any) {
    console.error('Token verification failed:', error.message);
    return {
      id: '',
      token: '',
      role: '',
    };
  }
};
