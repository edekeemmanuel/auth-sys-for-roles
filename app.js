// requiring .env
require("dotenv").config(/*{ path: path.join(_dirname, "../.env")}*/);
// requiring database
require("./config/database").connect();
// requiring server-side applications
const express = require("express")
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model/userModel");
const multer = require("multer");
const user = require("./controllers/userController");
const authorization = require("./middleware/authorization");

const morgan = require("morgan");
const path = require('path');


const app = express();

// const User = require("./model/userModel");
const upload = require("./utils/multerConfig");

app.use(express.static("./views"));
app.use(express.static(path.resolve('public')));
app.use(morgan("dev"));

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// logic entering
app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error:"session expired, kindly Login again"});
        }
        res.locals.loggedInUser = await User.findById(userId); next();
    } else {
        next();
    }
});


// display the home page
app.get('/', user.homepage);

//create user
app.post('/signup', user.signup);

//login user
app.post('/login', user.login);

app.get('/user/userId', user.allowIfLoggedin, user.getUser);
//router.get('/users', user.allowIfLoggedin, user.grantAccess('readAny', 'profile'), user.grantUsers);
app.put('/user/:userId', user.allowIfLoggedin, user.grantAccess('updateAny', 'profile',), user.updateUser);
app.delete('/user/:userId', user.allowIfLoggedin, user.grantAccess('deleteAny', 'profile'), user.deleteUser)

// verify the user account
app.get('/user/verify', user.verifyAccount);

// uploads the user image
app.post('/user/uploadPic', upload.single('avatar'), user.uploadImage);

// gets the user profile
app.post('/profile', authorization, user.getProfile);



module.exports = app;