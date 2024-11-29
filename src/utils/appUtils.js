import { compare, hash } from 'bcrypt';

export const comparePassword = async (candidatePassword, userPassword) =>
    await compare(candidatePassword, userPassword).catch(() => false);

export const hashPassword = async (password) =>
    await hash(password, 10).catch(() => false);