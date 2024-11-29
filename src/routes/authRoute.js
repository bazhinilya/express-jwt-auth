import { Router } from 'express';

import { register, login, refresh } from '../controllers/authController.js';

export const router = Router()
    .post('/register', register)
    .post('/login', login)
    .post('/refresh', refresh);