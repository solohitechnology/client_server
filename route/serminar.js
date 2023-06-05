const path = require("path");
const mime = require("mime");
const multer = require("multer");
const express = require("express");
const SeminarSchema = require("../model/seminar");
const User = require("../model/User");
const router = express.Router();
const NewsLetter = require("../model/NewsLetter");
const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.use(express.json());

router.post(
  "/api/seminar",
  upload.fields([{ name: "picture" }, { name: "pdf" }]),
  async (req, res) => {
    const { content, title } = req.body;
    const pictureFile = req.files["picture"] ? req.files["picture"][0] : null;

    try {
      const seminar = new SeminarSchema({
        content,
        title,
        picture: pictureFile
          ? {
              filename: pictureFile.filename,
              mimetype: pictureFile.mimetype,
              path: pictureFile.path,
            }
          : null,
      });

      await seminar.save();

      // send to users email
      const users = await User.find();
      const news = await NewsLetter.find();

      const mailUser = users.map((user) => user.email);
      const mailNews = news.map((mailnew) => mailnew.email);

      const mail = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      mail
        .sendMail({
          from: "<no-reply@email.com>",
          to: [...mailUser, ...mailNews],
          subject: title,
          text: content,
        })
        .then(() => console.log("Message sent"))
        .catch((error) => console.log(error));

      res.json({ message: "Seminar post created successfully" });
    } catch (error) {
      console.error("Error creating seminar post:", error);
      res.status(500).json({ message: "Error creating seminar post" });
    }
  }
);

router.get("/api/seminar", async (req, res) => {
  try {
    const seminar = await SeminarSchema.find().populate({
      path: "picture",
      model: PictureModel,
    });
    res.status(200).json(seminar);
  } catch (error) {
    console.error("Error fetching seminar posts:", error);
    res.status(500).json({ message: "Error fetching seminar posts" });
  }
});

module.exports = router;
