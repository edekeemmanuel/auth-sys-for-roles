const { userModel, profileModel, permissionModel } = require("./schema");
const { log } = console;

exports.create = async (body) => {
  let ifUser = await userModel.create(body);
  //permission
  const permission = {
    user: ifUser._id,
    type: body.role,
  };
  const ifPermission = await permissionModel.create(permission);
  if (!ifPermission) {
    console.log("permission creation failed");
    return res
      .status(400)
      .json({ ok: false, message: "permission creation failed" });
  }
  log(ifPermission);

  // create profile
  delete body.password;
  log({ message: body, badge: true });
  const profile = {
    accountId: ifUser._doc._id,
    name: body.name,
    email: body.email,
    status: body.status,
    status: ifUser._id,
    permission: ifPermission._id,
  };
  let userProfile = await profileModel.create(profile);

  return userProfile;
};

// exports.update = (body) => {
//   let user = {body
//   return user.updateOne(err => {
//     if (err) {
//       return err
//     }
//     return user
//   })
// }

exports.delete = (body) => {
  let user = { body };
  return user.deleteOne((err) => {
    if (err) {
      return err;
    }
    return user;
  });
};

exports.getAll = () => {
  return user.find({});
};

exports.getById = (id) => {
  return userModel.findById(id);
};

exports.getOne = (object) => {
  return user.findOne({ object });
};

exports.getProfile = async (id, res) => {
  try {
    let user = await userModel.findOne(id);
    if (!user) {
      console.log("user not found", false);
      return false;
    }
    profileModel
      .findOne({ email: user.email })
      .populate({ path: "status", select: "status" })
      .populate({ path: "permission", select: "type" })
      .exec((err, profile) => {
        if (err) {
          console.log(err);
          return false;
        }
        if (!profile) {
          console.log("user not found");
          return false;
        }
        profile.accountId = user._id;
        profile.status = user.status;
        if (!profile)
          return res
            .status(400)
            .json({ ok: false, message: "profile not found" });
        return res.json({
          ok: true,
          message: "user profile",
          data: profile,
        });
      });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

exports.access = async (req, res) => {
  try {
    console.log(req.user);
    let id = req.user.id;
    console.log(id);
    let checkPermission = await permissionModel.findOne({ id });
    if (!checkPermission) return console.log("permission error");
    let role = checkPermission.type;
    console.log(role);
    role = role == "superAdmin" ? true : false;
    console.log(role);
    return role;
  } catch (err) {
    throw err;
  }
};

exports.removeUser = async (body) => {
  // delete profile
  let deleteProfile = await profileModel.deleteOne({ email: body.email });
  if (!deleteProfile) {
    console.log("unable to delete profile");
    return false;
  }
  console.log("user profile removed");
  // remove permission  too
  let removePermission = await permissionModel.deleteOne({ user: body._id });
  if (!removePermission) {
    console.log("unable to remove permissions");
    return false;
  }
  console.log("permission deleted");
  // proceed to delete user
  let User = await userModel.deleteOne({ id: body._id });
  if (!User) {
    console.log("unable to remove user");
    return false;
  }
  return User;
};
