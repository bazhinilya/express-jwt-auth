import createError from '../middlewares/appError.js'
import RefreshToken from '../models/refreshTokenModel.js'

import { User } from '../models/userModel.js'
import { comparePassword } from '../utils/appUtils.js'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TIME, JWT_REFRESH_TIME } from '../config/appConfig.js'

export const login = async (req, res, next) => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const { error } = loginSchema.validate(req.body)
        if (error) {
            return next(new createError('Input data not valid', 422))
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(new createError('User is not found', 401))
        }
        const isPasswordMatch = await comparePassword(req.body.password, user.password)
        if (!isPasswordMatch) {
            return next(new createError('Incorrect email or password', 401))
        }
        const accessToken = JwtService.sign(user._id, JWT_ACCESS_TIME, JWT_ACCESS_SECRET)
        const refreshToken = JwtService.sign(user._id, JWT_REFRESH_TIME, JWT_REFRESH_SECRET)
        await RefreshToken.create({ token: refreshToken })
        res.status(200)
            .json({
                message: 'Logged in successfully',
                accessToken,
                refreshToken,
                data: user
            })
    } catch (err) {
        next(err)
    }
}