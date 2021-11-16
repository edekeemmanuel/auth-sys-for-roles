require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { SECRET } = process.env;
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel, permissionModel } = require("./schema");
const mailService = require("../../utils/email");
const { log } = console
const {success, error, info} = require('consola')
const model = require('./model')
const {verifyEmail, pageWelcome} = require('../../public/email/verification')

exports.superAdmin = async (req, res) => {
  try {
    let { name, password, email } = {
      name: "admin10",
      password: "admin1234",
      email: "admin10@mail.com",
    };
    password = await bcrypt.hash(password, 10);
    info({message:[name, email, password], badge: true})
    // check if admin exists
    const ifEmailExists = await userModel.findOne({ email: email });
    if (ifEmailExists) {
      log(ifEmailExists, "admin already exists");
      return res.status(400).json({
        message: "Admin already exists",
      });
    }
    const admin = {
      name,
      email,
      password,
      status: "activated",
      isAdmin: true,
      role: 'superAdmin',
    };
    const ifUser = await model.create(admin);
    // const ifUser = await userModel.create(admin);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._doc._id,
      type: "superAdmin",
    };
    const ifPermission = await permissionModel.create(permission);
    // create profile
    const profile = {
      ...admin,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);
    log("super admin created successfully");
    res.status(201).json({
      ok: true,
      profile,
      message: "Super Admin Registration Successful",
    });
  } catch (err) {
    log(err, "error in super admin creation");
    res.status(500).json({ ok: false, message: err.message });
  }
};

// signin as admin
exports.signin = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    let { email, password } = data;
    info({email, password, badge: true});
    let user = await userModel.findOne({ email });
    if (user) {
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        console.log(false, "failed");
        return res.status(400).json({
          ok: false,
          message: "Incorrect Password, User Login failed",
        });
      }
      log("password: %d", true);

      if (user.status != "activated") {
        console.log("pending verification");
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
      };

      const token = jwt.sign(payload, SECRET, { expiresIn: 86400 });
      return res.status(200).json({
        ok: true,
        message: "You are loggedIn as an admin loggedIn",
        token,
        id: user.id,
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Email, user not found" });
    }
  } catch (err) {
    res.status(422).json({ ok: false, message: err.message });
  }
};

// create user [user, admin, teacher]
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
    let { name, email, password } = data;
    password = await bcrypt.hash(password, 10);
    // check if user exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists) {
      return res.status(400).json({
        message: "Email already taken",
      });
    }

    const Url = req.protocol + "://" + req.get("host");
    const payload = {
      name: name,
      email: email,
      Url: Url,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
    // create user
    const newUser = {
      name,
      email,
      password,
      verificationCode: token,
    };
    const ifUser = await userModel.create(newUser);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
      type: role
    };
    const ifPermission = await permissionModel.create(permission);
    if (!ifPermission) {
      console.log("permission creation failed");
      return res
        .status(400)
        .json({ ok: false, message: "permission creation failed" });
    }
    console.log(ifPermission);

    // create profile
    const profile = {
      ...newUser,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);

    mailService.sendEmail({
      email: data.email,
      subject: "Verify your account",
      body: verifyEmail(name, Url, token),
    });

    res.status(201).json({
      ok: true,
      profile,
      message:
        "User Registration Successful, check your email to verify your account",
    });
  } catch (err) {
    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.dashboard = (req, res) => {
  try {
    console.log("dashboard loading");
    res.render("dashboard", {});
  } catch (err) {
    console.log(err.message);
  }
};
