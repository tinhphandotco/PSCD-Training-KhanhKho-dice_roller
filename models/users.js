const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true  },
    password: { type: String, required: true  },
    status: { type: String, enum: ["active", "pending", "block"], required: true, default: "active" }
}, {
        timestamps: true,
    })

const dataMigrate = [];
UserSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);