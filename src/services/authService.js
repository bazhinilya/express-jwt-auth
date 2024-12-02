import 'dotenv/config.js'

import JwtService from './jwtService.js';
import CreateError from '../middlewares/appError.js';

import { User } from '../models/userModel.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
import { comparePassword, hashPassword } from '../utils/appUtils.js';

export const getRegisterData = async (user) => {
    const isExists = await User.exists({ email: user.email });
    if (isExists) {
        throw new CreateError('This email is taken', 409);
    }
    const hashedPassword = await hashPassword(user.password);
    const newUser = await User.create({
        ...user,
        password: hashedPassword
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        newUser
    };
}

export const getLoginData = async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new CreateError('User is not found', 401);
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
        throw new CreateError('Incorrect email or password', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        user
    };
}

export const getRefreshData = async (refresh_token) => {
    const { token } = await RefreshToken.findOne({ token: refresh_token });
    if (!token) {
        throw new CreateError('Token is not found', 401);
    }
    const { _id: userId } = JwtService.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!userId) {
        throw new CreateError('Invalid refresh token', 401);
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new CreateError('User is not found', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        user
    };
}

const generateAccessToken = (id) =>
    JwtService.sign(id, process.env.JWT_ACCESS_TIME, process.env.JWT_ACCESS_SECRET);

const generateRefreshToken = (id) =>
    JwtService.sign(id, process.env.JWT_REFRESH_TIME, process.env.JWT_REFRESH_SECRET);