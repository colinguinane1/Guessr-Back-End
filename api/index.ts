import { Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
import cors, { CorsOptions} from 'cors'
const numberRoutes = require("../routes/Numbers");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
    'http://localhost:3000',            // Allow local development environment
    'https://numgame.up.railway.app',   // Allow production environment
    // Add more origins as needed
];

// Define CORS options
const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // If no origin (i.e., for non-browser requests like Postman), allow it
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
    credentials: true,  // Allow cookies or credentials in requests
};

// Apply the CORS middleware to the Express app
app.use(cors(corsOptions));

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
