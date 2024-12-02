import 'dotenv/config.js'

import mongoose from 'mongoose';

export const dbConnect = () =>
    mongoose.connect('mongodb://localhost:27017/auth')
        .then(() => console.log('Connect to mongodb'))
        .catch(err => console.error('Failed to connect to mongodb:', err));