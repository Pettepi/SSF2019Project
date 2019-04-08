'use strict';
const User = require('../models/users');

exports.user_list_get = () => {
    return User.find().then((users) => {
        return users;
    }).catch((err) => {
        console.log(err);
        return err;
    });
};

exports.user_create_post = (data) => {
    return User.create(data).then((item) => {
        return {status: 'Save OK:' + item.id};
    }).catch((err) => {
        console.log(err);
        return err;
    });
};