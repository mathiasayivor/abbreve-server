import express from "express";
import Joi from "joi";

import { translateSentence } from "./abbreviations";
import { detectLanguage } from "./nlp";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/translate", async (req, res) => {
  const schema = Joi.object({
    sentence: Joi.string().required().max(1000),
  });

  try {
    const { sentence } = await schema.validateAsync(req.query);

    const words = sentence.split(" ");

    if (words.length >= 50) {
      let language = detectLanguage(input);

      if (language !== "English") {
        language ??= "an unknown language";

        res.status(406).json({
          message: `Sorry, the provided sentence appears to be in ${language} We currently only support English`,
        });
      }
    }

    res.status(200).json(await translateSentence(sentence));
  } catch (e) {
    if (e instanceof Joi.ValidationError) {
      res.status(400).json({
        message: e.message,
      });
      return;
    }

    console.error(e);

    res.status(500).json({
      message: "An error occured whiles translating sentence",
    });
  }
});

app.use("/*", (req, res) => {
  res.status(404).json({
    message: "No route found for the specified path",
  });
});

app.listen(process.env.PORT || 4040);
