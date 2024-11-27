import createError from '../middlewares/appError.js'
import RefreshToken from '../models/refreshTokenModel.js'

import { User } from '../models/userModel.js'
import { hashPassword } from '../utils/appUtils.js'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TIME, JWT_REFRESH_TIME } from '../config/appConfig.js'

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const registerSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const { error } = registerSchema.validate(req.body)
        if (error) {
            return next(new createError('Input data not valid', 422))
        }
        const isExists = await User.exists({ email: email })
        if (isExists) {
            return next(new createError('This email is taken', 409))
        }
        const hashedPassword = hashPassword(password)
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        })
        const accessToken = JwtService.sign(newUser._id, JWT_ACCESS_TIME, JWT_ACCESS_SECRET)
        const refreshToken = JwtService.sign(newUser._id, JWT_REFRESH_TIME, JWT_REFRESH_SECRET)
        await RefreshToken.create({ token: refreshToken })
        res.status(201)
            .json({
                message: 'User registered successfully',
                accessToken,
                refreshToken,
                data: newUser
            })
    } catch (err) {
        next(err)
    }
}