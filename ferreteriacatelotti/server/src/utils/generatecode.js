import crypto from 'crypto';

export const generateRandomCode = (length) => {
    return crypto.randomBytes(length).toString('hex');
}