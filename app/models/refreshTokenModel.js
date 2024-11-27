import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }
})

export default RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)