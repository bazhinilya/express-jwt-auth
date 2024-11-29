import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true }
});

export default RefreshToken = model('RefreshToken', refreshTokenSchema);