require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { SECRET } = process.env;
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel, permissionModel } = require("./model");
const mailService = require("../../utils/email");
const { log } = require("console");
const {success, error, info} = require('consola')
log("admin handler loaded");

exports.superAdmin = async (req, res) => {
  try {
    let { name, password, email } = {
      name: "admin",
      password: "admin1234",
      email: "admin@mail.com",
    };
    password = await bcrypt.hash(password, 10);

    // check if admin exists
    const ifEmailExists = await userModel.findOne({ email });
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
    };
    const ifUser = await userModel.create(admin);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
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


exports.signin = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    let { email, password } = req.body;
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

exports.dashboard = (req, res) => {
  try {
    console.log("dashboard loading");
    res.render("dashboard", {});
  } catch (err) {
    console.log(err.message);
  }
};
