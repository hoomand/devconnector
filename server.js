const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// DB Connection
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.error(err));

app.get("/", (req, res) => res.send("Hello"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
