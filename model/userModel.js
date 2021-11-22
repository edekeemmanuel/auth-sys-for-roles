const mongoose = require("mongoose");
const { Schema, model, SchemaTypeOptions} = require ('mongoose');

const userSchema = new mongoose.Schema({
    // user details
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // user roles
    role: {
        type: String,
        default: "basic",
        enum: ["user", "teacher", "admin", "superAdmin"]
    },
    // token/info use to identify user
    accessToken: {
        type: String
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;

const profileSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    permission : {
        type: Schema.Types.ObjectId,
        ref: 'permissions'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },    
    updatedAt: {
        type: Date,
        default: Date.now
    }     
})

exports.profileModel = model('profile', profileSchema)

const permissionSchema = new Schema ({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },    
    updatedAt: {
        type: Date,
        default: Date.now
    } 
})

exports.permissionModel = model('permissions', permissionSchema)