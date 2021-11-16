const {Schema, model} = require('mongoose')

const gradeSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
      expires: 3600,
    },
  });

exports.gradeModel = model("teachers", gradeSchema);
