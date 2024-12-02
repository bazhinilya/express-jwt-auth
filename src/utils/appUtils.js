import bcrypt from 'bcryptjs';

export const comparePassword = async (candidatePassword, userPassword) =>
    await bcrypt.compare(candidatePassword, userPassword).catch(() => false);

export const hashPassword = async (password) =>
    await bcrypt.hash(password, 10).catch(() => false);