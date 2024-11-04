import { Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB.")).catch((err: any) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("Express on Vercel"));

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
