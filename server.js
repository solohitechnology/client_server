require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./route/auth')
const blogpostRoute = require('./route/blog');
const serminarRoute = require('./route/serminar');
const certificate = require('./route/certificate');
const uploadbookRoutes = require("./route/uploadBooks");

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoute);
app.use('/api/blog', blogpostRoute);
app.use('/api/seminar', serminarRoute);
app.use('/api/books', uploadbookRoutes);
app.use('/api/cert', certificate)


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
