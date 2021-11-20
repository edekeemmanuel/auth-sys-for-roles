const {Schema, model} = require('mongoose')
const schema = require('../admin/schema')
const teacherSchema = new Schema({
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const gradeSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    submission: {
        type: Schema.Types.ObjectId,
        ref: "assignment",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

exports.teacherModel = model("teachers", teacherSchema);
exports.gradeModel = model("grades", gradeSchema);
exports.schema 
