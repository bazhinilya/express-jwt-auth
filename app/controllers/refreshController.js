import createError from '../middlewares/appError.js'
import RefreshToken from '../models/refreshTokenModel.js'

import { User } from '../models/userModel.js'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TIME, JWT_REFRESH_TIME } from '../config/appConfig.js'

export const refresh = async (req, res, next) => {
    try {
        const tokenSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const { error } = tokenSchema.validate(req.body)
        if (error) {
            return next(new createError('Input data not valid', 422))
        }
        const refreshTokenObj = await RefreshToken.findOne({ token: req.body.refresh_token })
        if (!refreshTokenObj) {
            return next(new createError('Token is not found', 401))
        }
        const { _id: userId } = JwtService.verify(refreshTokenObj.token, JWT_REFRESH_SECRET);
        if (!userId) {
            return next(new createError('Invalid refresh token', 401))
        }
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return next(new createError('User not found', 401))
        }
        const accessToken = JwtService.sign(newUser._id, JWT_ACCESS_TIME, JWT_ACCESS_SECRET)
        const refreshToken = JwtService.sign(newUser._id, JWT_REFRESH_TIME, JWT_REFRESH_SECRET)
        await RefreshToken.create({ token: refreshToken })
        res.status(201)
            .json({
                message: 'New token generated',
                accessToken,
                refreshToken,
                data: user
            })
    } catch (err) {
        next(err)
    }
}