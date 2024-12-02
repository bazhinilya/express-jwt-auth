import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true }
});

export const RefreshToken = model('RefreshToken', refreshTokenSchema);