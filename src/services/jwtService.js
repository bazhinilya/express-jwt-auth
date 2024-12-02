import jwt from 'jsonwebtoken';

export default class JwtService {
    static sign(id, expiry, secret) {
        return jwt.sign({ _id: id }, secret, { expiresIn: expiry });
    }
    static verify(token, secret) {
        return jwt.verify(token, secret);
    }
}