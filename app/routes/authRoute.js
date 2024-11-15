import express from 'express'
import { signup, login } from '../controllers/authController.js'

export const router = express.Router()
    .post('/signup', signup)
    .post('/login', login)
