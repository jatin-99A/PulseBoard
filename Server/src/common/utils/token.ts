import crypto from 'node:crypto';
import JWT from 'jsonwebtoken';
import env from '../../config/env.js';
import { cache, getValue } from '../../services/redis/redis.js';

export interface TokenPayload {
  id: string;
  [key: string]: any;
}

const JWT_SECRET: string = env.JWT_SECRET;

export default class TokenService {
  static generatePayloadToken(
    payload: TokenPayload,
    expiresIn: JWT.SignOptions['expiresIn']
  ): string | null {
    try {
      return JWT.sign(payload, JWT_SECRET, { expiresIn });
    } catch {
      return null;
    }
  }

  static verifyPayloadToken<T = TokenPayload>(token: string): T | null {
    try {
      return JWT.verify(token, JWT_SECRET) as T;
    } catch {
      return null;
    }
  }

  static async generateRefreshToken() {
    try {
      const token = crypto.randomBytes(40).toString('hex');

      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      return { hashedToken, token };
    } catch (error) {
      return null
    }
  }

  static async verifyRefreshToken(token: string) {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const userId = await getValue(`refresh:${hashedToken}`);

      return userId;

    } catch (error) {
      return null;
    }
  }

  static async revokeRefreshToken(token: string) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await cache.del(`refresh:${hashedToken}`);
  }
}