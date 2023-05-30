const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  content: String,
  date: Date,
  picture: {
    filename: String,
    mimetype: String,
    path: String,
  },
  author: String,
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
