import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import crypto from 'crypto';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );
}

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
}

export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}
