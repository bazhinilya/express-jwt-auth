import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { router } from './app/routes/authRoute.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', router)

mongoose.connect('mongodb://localhost:27017/auth')
    .then(() => console.log('Connect to mongodb'))
    .catch(err => console.error('Failed to connect to mongodb:', err))

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`App runing on ${PORT}`)
})