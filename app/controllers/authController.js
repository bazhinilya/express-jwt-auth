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
        const token = jwt.sign({ _id: newUser._id }, 'secret', {
            expiresIn: '90d'
        })

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token
        })
    } catch (err) {
        next(err)
    }
}

export async function login(req, res, next) { }