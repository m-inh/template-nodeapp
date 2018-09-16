'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    name: String,
    gender: String,
    password: String,
    password_salt: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;