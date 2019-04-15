'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true
    }
});

userSchema.statics.authenticate((email, password, callback) => {
   User.findOne({ email: email})
       .exec((err, user) => {
           if (err){
               return callback(err)
           } else if (!user) {
               let err = new Error('User not found.');
               err.status = 401;
               return callback(err);
           }
           bcrypt.compare(password, user.password, function (err, result) {
               if (result === true) {
                   return callback(null, user);
               } else {
                   return callback();
               }
           })
       })
});

let User = mongoose.model('User', userSchema);
module.exports = User;