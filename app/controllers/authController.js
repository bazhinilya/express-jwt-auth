import { User } from '../models/userModel.js'
import createError from '../middlewares/appError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function signup(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            return next(new createError())
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        })
        const token = jwt.sign({ _id: newUser._id }, 'secret', { expiresIn: '90d' })

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token
        })
    } catch (err) {
        next(err)
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return next(new createError('User not found', 404))
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return next(new createError('Incorrect email or password', 401))
        }
        const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '90d' })

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        next(err)
    }
}