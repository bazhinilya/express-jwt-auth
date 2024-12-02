import 'dotenv/config.js'

import mongoose from 'mongoose';

export const dbConnect = () =>
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connect to mongodb'))
        .catch(err => console.error('Failed to connect to mongodb:', err));