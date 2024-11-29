import { sign, verify } from 'jsonwebtoken';

export default class JwtService {
    static sign(id, expiry, secret) {
        return sign({ _id: id }, secret, { expiresIn: expiry });
    }
    static verify(token, secret) {
        return verify(token, secret);
    }
}