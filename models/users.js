const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const UserSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true  },
    status: { type: String, enum: ["active", "pending", "block"], required: true, default: "pending" }
}, {
        timestamps: true,
    })

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);