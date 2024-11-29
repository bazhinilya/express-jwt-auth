import express from 'express';
import cors from 'cors';

import { PORT } from './src/configs/envConfig.js';
import { router } from './src/routes/authRoute.js';
import { connect } from './src/configs/dbConfig.js';

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

app.listen(PORT || 3000, () => {
    console.log(`App runing on ${PORT}`);
    connect();
});