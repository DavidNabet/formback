const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(formidable());
app.use(cors());

//Mailgun config
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.get("/", (req, res) => {
  res.json("Hello, welcome to the part backend");
});

app.post("/form", (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.fields;
    if (!firstname || !lastname || !email || !subject || !message) {
      res.status(400).json({ message: "Renseignez tous les champs !" });
    } else {
      const data = {
        from: `${firstname} ${lastname} <${email}>`,
        to: process.env.MY_EMAIL,
        subject: subject,
        text: message,
      };

      mailgun.messages().send(data, (error, body) => {
        if (!error) {
          console.log(body);
          res.status(203).json({
            confirmation: "success",
            message: "Données reçues, mail envoyé !",
          });
        }
        console.log(error);
        res.status(401).json(error);
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "All routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server listen");
});
