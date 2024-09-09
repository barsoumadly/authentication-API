import jwt from 'jsonwebtoken';
import { envVariables } from '../config/envVariables.js';

const createAndSendToken = function (userId, response) {
  const token = jwt.sign({ userId }, envVariables.JWT_SECRET, {
    expiresIn: envVariables.JWT_EXPIRES_AT,
  });

  response.cookie('token', token, {
    httpOnly: true,
    secure: envVariables.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export default createAndSendToken;
