import { Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const numberRoutes = require("../routes/Numbers");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'https://num-game-front-end.vercel.app' }));

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

// num-game-front-nrhsm1r2p-colinguinane1s-projects.vercel.app/:1 Access to fetch at 'https://num-game-back-end.vercel.app/api/numbers/current' from origin 'https://num-game-front-nrhsm1r2p-colinguinane1s-projects.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.