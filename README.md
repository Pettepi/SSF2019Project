# SSF2019Project
Market data node project for SSF2019 course

This projects backend is divided into different folders for simplicity and efficiency.

Controllers, models and routers are separate from the index.js file so the main file doesn't become cluttered.
userController is a simple controller file with a register and login functionality. It uses bcrypt to hash sensitive information and credential checking.
Models folder includes a users.js file which has a userSchema with a username and a password.
Routers are separated into each functionality, which in this case is displaying and handling stock information and handling user events like register and login.

The main file is responsible for connecting to the database and creating a secure connection with HTTPS.