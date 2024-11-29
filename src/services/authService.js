import JwtService from './jwtService.js';
import CreateError from '../middlewares/appError.js';

import { User } from '../models/userModel.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';

export const getRegisterData = async (user) => {
    const isExists = await User.exists({ email: user.email });
    isExists && next(new CreateError('This email is taken', 409));

    const hashedPassword = hashPassword(user.password);
    const newUser = await User.create({
        ...user,
        password: hashedPassword
    });

    const accessToken = getAccessToken(newUser._id);
    const refreshToken = getRefreshToken(newUser._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        newUser
    };
}

export const getLoginData = async (email, password) => {
    const user = await User.findOne({ email: email });
    !user && next(new CreateError('User is not found', 401));

    const isPasswordMatch = await comparePassword(password, user.password);
    !isPasswordMatch && next(new CreateError('Incorrect email or password', 401));

    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        user
    };
}

export const getRefreshData = async (refresh_token) => {
    const {token} = await RefreshToken.findOne({ token: refresh_token });
    !token && next(new CreateError('Token is not found', 401));

    const { _id: userId } = JwtService.verify(token, JWT_REFRESH_SECRET);
    !userId && next(new CreateError('Invalid refresh token', 401));

    const user = await User.findOne({ _id: userId });
    !user && next(new CreateError('User not found', 401));

    const accessToken = getAccessToken(user._id);
    const refreshToken = getRefreshToken(user._id);

    await RefreshToken.create({ token: refreshToken });
    return {
        accessToken,
        refreshToken,
        user
    };
}

const getAccessToken = async (id) =>
    JwtService.sign(id, JWT_ACCESS_TIME, JWT_ACCESS_SECRET);

const getRefreshToken = async (id) =>
    JwtService.sign(id, JWT_ACCESS_TIME, JWT_ACCESS_SECRET);