// userModel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// Note subdocument schema
const noteSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  note: {
    type: String,
    required: true,
  },
});

// User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: [noteSchema],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
export { User };
