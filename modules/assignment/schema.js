const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.set('useCreateIndex', true);
mongoose.set("returnOriginal", false);

const assignmentSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    deadline: {
        type: Date,
        required: true,
    },
    track: {
        type: String,
        required: true,
        trim: true
    },
    submissionLink: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'teachers',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});