const { Schema, model } = require("mongoose");

const NewsLetterSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    trim: true,
  },
});

const NewsLetter = model("NewsLetter", NewsLetterSchema);

module.exports = NewsLetter;
