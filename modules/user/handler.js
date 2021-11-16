require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { success, error, info } = require("consola");
const { SECRET } = process.env;
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel, permissionModel } = require("./schema");
const model = require("./model");
const mailService = require("../../utils/email");
const { verifyEmail, pageWelcome } = require("../../public/email/verification");
const { log } = console;

exports.createUser = async (req, res) => {
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    role: joi.string(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    cpassword: joi.ref("password"),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let { name, email, password, role } = data;
    password = await bcrypt.hash(password, 10);
    // check if user exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists) {
      return res.status(400).json({
        message: "Email already taken",
      });
    }
    // define user type
    let isAdmin = role == "admin" ? true : false;
    let isTeacher = role == "teacher" ? true : false;

    const Url = req.protocol + "://" + req.get("host");
    // create user
    const newUser = {
      name,
      email,
      password,
      role: role ? role : "user",
      isAdmin,
      isTeacher,
    };

    const ifUser = await model.create(newUser);

    log(ifUser);
    if (!ifUser)
      res.status(404).json({ ok: false, message: "User not created" });
    else {
      const payload = {
        id: ifUser._doc.accountId,
        name: name,
        email: email,
        Url: Url,
      };
      let token = jwt.sign(payload, SECRET, { expiresIn: "1d" });

      mailService.sendEmail({
        email: data.email,
        subject: "Verify your account",
        body: verifyEmail(name, Url, token),
      });
      log(ifUser._doc, token);
      res.status(201).json({
        ok: true,
        data: ifUser._doc,
        message:
          "User Registration Successful, check your email to verify your account",
      });
    }
  } catch (err) {
    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.signin = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    let { email, password } = data;
    let user = await userModel.findOne({ email });
    if (user) {
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        log(false, "failed");
        return res.status(400).json({
          ok: false,
          message: "Incorrect Password, User Login failed",
        });
      }
      log("password: %d", true);

      if (user.status != "activated") {
        log("pending verification");
        return res.status(401).json({
          ok: false,
          message: "Pending account. Please verify your email",
        });
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isTeacher: user.isTeacher,
      };
      const token = jwt.sign(payload, SECRET, { expiresIn: 86400 });
      return res.status(200).json({
        ok: true,
        message: "User loggedIn",
        token,
        userId: user.id,
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Email, user not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.verify = async (req, res) => {
  let verificationCode = req.query.token;
  try {
    let getURl = await jwt.verify(verificationCode, SECRET);
    console.log({ fromCode: getURl });
    let Url = await getURl.Url;
    let Id = await getURl.id;
    let name = await getURl.name;
    let user = await model.getById(Id);
    if (!user) {
      res.json({ error: "failed to verify" });
      return;
    } else {
      delete user.password;
      user.status = "activated";
      let uservalidate = await user.save();
      if(!uservalidate) return
      res.json({ ok: true, message: "user account verified", data: user });
      mailService.sendEmail({
        email: user.email,
        subject: "Account Activated",
        body: pageWelcome(name, Url),
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    let id = {_id: req.params.id};
    let profile = await model.getProfile(id, res)
    if(profile) return success({message: 'profile operation successful', badge: true})
    else return error({message: 'profile operation failed', badge: true})
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ok: false, message: err.message})
    return;
  }
};

/* Endpoint action functions */
exports.allUsers = async (req, res) => {
  try {
    let Users = await userModel.find({});
    if (Users.length > 0)
      return res.status(200).json({
        status: 200,
        data: Users,
        message: `${Users.length} Users found`,
      });
    else return res.status(404).json({ status: 404, error: "No record found" });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "failed to get users"],
    });
  }
};

exports.singleUser = async (req, res) => {
  try {
    let id = { _id: req.params.id };
    let user = await userModel.findOne(id, (err, user) => {
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
      if (err) {
        console.log(err);
        return res.status(400).json({ ok: false, message: err });
      }
      delete user.password;
      return user;
    });
    res.status(200).json({
      ok: true,
      data: user,
      message: `User found`,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    let { name, location, address, occupation, phone } = req.body;
    pics = req.file === undefined || null ? "nopics.jpg" : req.file.filename;

    console.log(pics, req.file);
    let updateUser = {
      name,
      photo: pics,
      location,
      phone,
      address,
      occupation,
    };
    let id = { _id: req.params.id };
    userModel.findOne(id, (err, user) => {
      if (user) {
        profileModel.updateOne(
          { email: user.email },
          updateUser,
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({ ok: false, message: err });
            }
            res.status(201).json({
              ok: true,
              data: result,
              photo: pics,
              message: `User profile updated`,
            });
          }
        );
      } else {
        console.log(err.message);
        res.status(404).json({
          ok: false,
          message: `User update failed`,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: [err.message, "Update failed because User is not found"],
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let id = { _id: req.params.id };
    let findUser = await userModel.findOne(id);
    if (!findUser) {
      console.log("users not found");
      return res.status(404).json({ ok: false, message: "user not found" });
    }
    // permission to delete admin
    if(findUser.isAdmin) {
     let permission =  await model.access({id: req.user.id})
     if(!permission) {
       console.log('unauthorized to perform operation')
       res.status(401).json({message: 'Unauthorized only super admin can perform operation'})
     }
     if(permission) {
      let deleteUser = await model.removeUser(findUser);
      if(!deleteUser) return res.status(400).json({
        ok: false, 
        message: 'user not deleted',
      })
      return res.status(200).json({
        ok: true,
        message: "User has been deleted",
        completed: true,
      });
     } 
    }
    // delete profile
    let deleteUser = await model.removeUser(findUser)
    if(!deleteUser) return res.status(400).json({
      ok: false, 
      message: 'user not deleted',
    })
    return res.status(200).json({
      ok: true,
      message: "User has been deleted",
      completed: true,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: [`failed to delete user with id: ${req.params.id}`, err.message],
    });
  }
};
