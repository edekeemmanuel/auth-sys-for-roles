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
    Stage: {
        type: String,
        required: true,
        enum: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6', 'Stage 7', 'Stage 8']
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