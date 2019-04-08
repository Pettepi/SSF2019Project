'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    age: Number,
    gender: {type: String, enum: ['male', 'female']}
});

module.exports = mongoose.model('User', userSchema);