const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
var Joi = require('joi');

const UserSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "pending", "block"], required: true, default: "pending" }
}, {
        timestamps: true,
    })

UserSchema.methods.joiValidate = function (obj) {
    var schema = {
        firstname: Joi.string().min(2).max(30).required(),
        lastname: Joi.string().min(2).max(30).required(),
        username: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        status: Joi.string().required(),
    }
    return Joi.validate(obj, schema);
}

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);

