import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey = Buffer.from(
  config.get<string>('privateKey'),
  'base64',
).toString('ascii');

const publicKey = Buffer.from(
  config.get<string>('publicKey'),
  'base64',
).toString('ascii');

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'Jwt Expired',
      decoded: null,
    };
  }
}
