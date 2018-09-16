const api = require('express').Router();
const mongoose = require('mongoose');
const config = require('config');

const {success, fail, unauthorized} = require('../utils/response');
const {mustHave} = require('../middlewares/verify-payload');
const {basicAuth, jwtAuth} = require('../middlewares/auth');
const jwtUtils = require('../utils/jwt');
const cryptoUtils = require('../utils/crypto');

const User = mongoose.model('User');
const secret = config.get('service.secret');

// api.get('/users', (req, res) => {
//     return res.json({hello: "you"});
// });

// api.get('/users/:id', (req, res) => {
//     return res.json({hello: "you"});
// });

api.put('/users/:id',
    jwtAuth(),

    async (req, res) => {
        try {
            // const user = await User.findOne({username});

            return res.json(success({user: req.user}));
        }
        catch (err) {
            console.log(err);
            res.json(fail(err.message));
        }
    }
);

api.post('/users/login',
    mustHave(
        "username",
        "password"
    ),

    async (req, res) => {
        const {username, password} = req.body;

        try {
            const user = await User.findOne({username});
            const hashPass = cryptoUtils.hashPassword(password, user.password_salt);
            const passwordMatch = hashPass === user.password;

            if (!user || !passwordMatch) throw new Error("Thông tin đăng nhập không đúng");
            const access_token = await jwtUtils.generateAccessToken(user.toJSON(), secret, '1d');

            return res.json(success({access_token, user}));
        }
        catch (err) {
            console.log(err);
            res.json(fail(err.message));
        }
    }
);

api.post('/users/register',
    mustHave(
        'username',
        'name',
        'password',
        'phone',
        'gender'
    ),
    async (req, res) => {
        const {username, password, gender, phone, name} = req.body;

        try {
            const password_salt = cryptoUtils.genRandomString(10);
            const hashPass = cryptoUtils.hashPassword(password, password_salt);
            const newUser = new User({username, name, password: hashPass, password_salt, phone, gender});
            const savedUser = await newUser.save();

            return res.json(success(savedUser));
        }
        catch (err) {
            console.log(err);
            res.json(fail("Tên người dùng đã tồn tại"));
        }
    }
);

module.exports = api;