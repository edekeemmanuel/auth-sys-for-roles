const {User, profileModel, permissionModel} = require("../model/userModel");
const { roles } = require("../roles");
// transfer info without issues
const jwt = require("jsonwebtoken");
// hash user password and store sensitive information
const bcrypt = require("bcrypt");
const joi = require("joi");
const { userDatabase, profileDatabase } = require("../model/userRecord");
const emailService = require('../utils/email');
const accountDb = userDatabase;
const fs = require('fs'),
    path = require("path");


    
// console.log(email.sendEmail);
exports.homepage = function(req, res) {
    res.render('app');
};

// handler
exports.profile = function(req, res) {
    res.sendFile(path.resolve("views/profile.html"));
};

exports.uploadImage = (req, res) => {

    if (req.file) {

        // move image to public directory
        fs.renameSync(path.resolve(req.file.path), path.resolve(`public/img/${req.file.filename}`));

        res.status(201).json({
            okay: true,
            image: `../img/${req.file.filename}`,
            message: "File uploaded successfully"
        });

    } else res.status(304).json({ okay: false, message: "Failed to upload image" });
};

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// validate user password
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashPassword);
}

exports.signup = async (req, res, next) => {
    // design object schema for joi
    const objectSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
        Confirmpassword: joi.ref('password'),
        role: joi.string().required()
    });
    try {
        const data = await objectSchema.validateAsync(req.body);
        let { name, email, password, role } = data;
        
        // hashes the user password
        const hashedPassword = await hashPassword(password); 
               
        // creating new user 
        const newUser = new User ({name, email, password: hashedPassword, role: role || "user"});
        
        // saves the user and profile in the db
        // const newUser = await User.create(user);

         // setup permission & encrypt userID
         const accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
         });
         newUser.accessToken = accessToken;
         await newUser.save();
        
        // send account activation email
        emailService.sendEmail({
            email: createdUser.email,
            subject: 'Verify your account',
            body: `<h3> Welcome to our platform </h3> <p> Please use the button below to verify your account </p> <a href='http://localhost:3000/user/verify/?secure=${token}'> Active account </a>` 
        })
        
        // sends out response to the client
        res.json({ data: newUser, accessToken, okay: true, message: "User created successfully" });
    } catch (error) {
        next(error)
    }
}


// verify user account
exports.verifyAccount = async(req, res) => {
    const accessToken = req.query.secure;
    try{
        //get the user id
        const {id} = jwt.verify(accessToken, process.env.JWT_SECRET);
        // get the user from database
        const user = accountDb.find(data => data.id == id);
        log(user.status);
        // if user exist
        if (user) {
            // check if their not verified
            if (user.status !== 'verified') {
                // verify user account
                user.status = 'Verified';
                accountDb.splice(accountDb.indexOf(user), 1, user);
              
    
                // send them an account verified email
                emailService.sendEmail({
                   email: user.email,
                   subject: 'Account verified',
                   body: '<h3>Welcome to our platform</h3> <p>Your account has been verified</p>' 
                });
                // send a response to the client
                res.status(200).json({okay: true, message: 'Account verified successfully'});
            } else res.status(304).json({okay: false, message: 'User account already verified'});
        } else res.status(404).json({okay:false, message: 'User not found'});
    } catch(err) {
        
    }
    };
    
    exports.login = async (req, res, next) => {
        const object = joi.object({
            email: joi.string().email({ minDomainSegments: 2 }).required(),
            password: joi.string().required()
        });

        try {
            const data = await object.validateAsync(req.body);
            const { email, password } = data;
            const user = await User.findOne({ email });
            
            if (!user) return next(new Error("Email does not exist"));
            const validPassword = validatePassword(password, user.password);
            if (!validPassword) return next(new Error("Password is not correct"))
            const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
                expiresIn: "2d"
            });
            await User.findByIdAndUpdate(user._id, { accessToken })
            res.status(200).json({data: { email: user.email, role: user.role}, accessToken})
        } catch (error) {
            next(error);
        }
    }

    exports.getUsers = async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json({data: users});
    }

    exports.getUser = async (req, res, next) => {
        try{
            // get the id from the request
            const userId = req.params.userId;
            // find the user with the id
            const user = await User.findById(userId);
            // if the user id doesn't match the id from the request return user not found
            if(!user) return next(new Error("User does not exist"));
            // check if user exists before sending out response
            res.status(200).json({ data: user });
        } catch (error) {
            next(error)
        }
    }

    exports.updateUser = async (req, res, next) => {
        try{
            const update = req.body
            const userId = req.params.userId;
            await User.findByIdAndUpdate(userId, update);
            const user = await User.findById(userId)
            res.status(200).json({
                data: user, message: "User has been updated"
            });
        } catch (error) {
            next(error)
        }
    }

    exports.deleteUser = async (req, res, next) => {
        try{
            const userId = req.params.userId;
            await User.findByIdAndDelete(userId);
            res.status(200).json({
                data: null, message: "User has been deleted"
            });

        } catch (error) {
            next(error)
        }
    }


    exports.getProfile = async(req, res) => {
        const email = res.locals.userEmail;
    
        // gets the user account details
        const account = await User.findOne({email: email}) 
        console.log(account);    
        //checks if user exist
        if(account) {
            // get user profile details
        profileModel
        .findOne({email: email}
        .populate({path: 'status', select: 'status'})
        .populate ({path:'permission', select: 'type'})
        .exec((err, profile) =>{
            if (err) console.log(err)
            console.log(profile.email.user.email)
      
            if  (profile.email == account.email) {
                // attaches the user profile to the user account  
                profile.userId = user.id;
                profile.status = user.status;
                // sends out response to the client
                res.status(200).json({ okay: true, data: profile });
            } else res.status(404).json({ okay: false, message: 'User profile not found' });
        }));   
    
    } else res.status(404).json({ okay: false, message: 'User account not found' });
    };

    exports.updateProfile = async (req, res, next) => {
        try{
            const update = req.body
            const email = req.params.email;
            await profile.findByIdAndUpdate(email, update);
            const user = await profile.findById(email)
            res.status(200).json({
                data: user, message: "Profile has been updated"
            });
        } catch (error) {
            next(error)
        }
    }

    exports.grantAccess = function(action, resource) {
        return async (req, res, next) => {
            try{
                const permission = roles.can(req.user.role)[action](resource);
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "No permission granted"
                    });
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }

    exports.allowIfLoggedin = async (req, res, next) => {
        try {
            const user = res.locals.loggedInUser;
            if (!user)
            return res.status(401).json({
               error: "access denied, login again" 
            });
            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    }