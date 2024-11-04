import { Request, Response } from "express";
import { mongo } from "mongoose";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => res.send("Express on Vercel"));

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
