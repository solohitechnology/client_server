const { Router } = require("express");
const NewsLetter = require("../model/NewsLetter");

const newsRouter = Router();

newsRouter.post("/letter", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new Error("Email can't be empty");

    await NewsLetter.create({ email })
      .then(() => res.status(201).send("Successfully subscribed!"))
      .catch((error) => console.log(error));
  } catch (error) {
    next(error);
  }
});

newsRouter.get("/letter", async (req, res, next) => {
  try {
    const news = await NewsLetter.find();
    return res.status(200).send(news);
  } catch (error) {
    next(error);
  }
});

module.exports = newsRouter;
