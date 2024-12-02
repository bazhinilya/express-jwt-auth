import 'dotenv/config.js'

import express from 'express';
import cors from 'cors';

import { router } from './src/routes/authRoute.js';
import { dbConnect } from './src/configs/dbConfig.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', router);

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode)
        .json({
            status: err.status,
            message: err.message,
        });
});

const PORT = process.env.NODE_PORT
app.listen(PORT, () => {
    console.log(`App runing on ${PORT}`);
    dbConnect();
});