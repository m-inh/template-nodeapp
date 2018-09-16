const crypto = require('crypto');

function hashPassword(password, salt) {
    const hash = crypto.createHash('sha256').update(password);
    hash.update(salt);
    return hash.digest('hex');
}

function genRandomString(numberOfCharacter) {
    return crypto.randomBytes(numberOfCharacter).toString('hex');
}

module.exports = {
    hashPassword,
    genRandomString
};