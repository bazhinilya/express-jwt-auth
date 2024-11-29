import CreateError from '../middlewares/appError.js';

import { getRegisterData, getLoginData, getRefreshData } from '../services/authService.js';

export const register = async (req, res, next) => {
    try {
        const registerSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const { error } = registerSchema.validate(req.body);
        error && next(new CreateError('Input data not valid', 422));

        const { accessToken, refreshToken, newUser } = await getRegisterData(req.body);
        res.status(201)
            .json({
                message: 'User registered successfully',
                accessToken,
                refreshToken,
                data: newUser
            });
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const { error } = loginSchema.validate(req.body);
        error || next(new CreateError('Input data not valid', 422));

        const { accessToken, refreshToken, user } = await getLoginData(req.body);
        res.status(200)
            .json({
                message: 'Logged in successfully',
                accessToken,
                refreshToken,
                data: user
            });
    } catch (err) {
        next(err);
    }
}

export const refresh = async (req, res, next) => {
    try {
        const tokenSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const { error } = tokenSchema.validate(req.body);
        error && next(new CreateError('Input data not valid', 422));

        const { accessToken, refreshToken, user } = await getRefreshData(req.body.refresh_token);
        res.status(201)
            .json({
                message: 'New token generated',
                accessToken,
                refreshToken,
                data: user
            });
    } catch (err) {
        next(err);
    }
}