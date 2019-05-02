'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const userController = require('../controllers/userController');
const session = require('express-session');

router.post('/register', (req, res) => {
    User.findOne({username: req.body.username}).then(user => {
        if (user) {
            res.send('User already exists.');
        }
        else {
            userController.register_user(req).then((result) =>{
                res.send('User: '+ result.username +'successfully created.');
            });
        }
    });
});

router.post('/login', (req, res) => {
    userController.login_user(req, res).then((result) => {
        res.send(result);
    });
});

//GET logout
router.get('/logout', (req, res, next) => {
   if (req.session) {
       //delete session
       req.session.destroy((err) => {
           if (err) {
               return next(err);
           } else {
               return res.redirect('/');
           }
       });
   }
});

module.exports = router;