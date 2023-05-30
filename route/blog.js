const express = require( 'express');
const multer  = require ('multer');
const path = require ('path');
const mime = require( 'mime');
const BlogPost = require('../model/Blogpost')

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([{ name: 'picture' }, { name: 'pdf' }]);

router.post('/blog-posts', upload, async (req, res) => {
  const { title, content, date, author } = req.body;
  const pictureFile = req.files['picture'] ? req.files['picture'][0] : null;

  try {
    const newBlogPost = new BlogPost({
      title,
      content,
      date,
      picture: pictureFile
        ? {
            filename: pictureFile.filename,
            mimetype: pictureFile.mimetype,
            path: pictureFile.path,
          }
        : null,
      author,
    });

    await newBlogPost.save();

    res.json({ message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});

router.get('/blog-posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});

module.exports= router;
