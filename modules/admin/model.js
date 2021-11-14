const { Schema, model } = require("mongoose");
// users Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
      tirm: true,
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "activated"],
      default: "pending",
      trim: true,
    },
    verificationCode: {
      type: String,
    },
    isAdmin:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

//user profile schema
const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "permissions",
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      min: [10, "Must be at least 10, got {VALUE}"],
      max: 14,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const permissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "teacher", "user"],
      default: "user",
      trim: true,
    },
  },
  { timestamps: true }
);


const tokenSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  });

  

exports.userModel = model("users", userSchema);
exports.profileModel = model("profiles", profileSchema);
exports.permissionModel = model("permissions", permissionSchema);
exports.tokenModel = model("tokens", tokenSchema);
