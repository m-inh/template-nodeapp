const config = require('config');
const jwt = require('jsonwebtoken');

const {unauthorized} = require('../../utils/response');

const secret = config.get('service.secret');

async function verifyJwt(_token, _secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(_token, _secret, function (err, payload) {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
}

module.exports = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const payload = await verifyJwt(token, secret);
            req.user = payload;
            next();
        }
        catch (err) {
            res.json(unauthorized("Không thể xác thực người dùng"));
        }
    }
};