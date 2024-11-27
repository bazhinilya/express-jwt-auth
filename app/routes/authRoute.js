import { Router } from 'express'

import { register } from '../controllers/registerController.js'
import { login } from '../controllers/loginController.js'
import { refresh } from '../controllers/refreshController.js'

export const router = Router()
    .post('/register', register)
    .post('/login', login)
    .post('/refresh', refresh)