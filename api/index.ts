import { Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const numberRoutes = require("../routes/Numbers");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
     '*'
  ],
  methods: ['GET', 'POST'], // Allow only GET and POST methods (customize as needed)
}));

app.options('*', cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(
    () => console.log("Connected to MongoDB."),
    app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`))
  )
  .catch((err: any) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("API is running"));

app.use("/api/numbers", numberRoutes);

module.exports = app;
