import express, { Request, Response } from 'express';
// import {body, validationResult} from "express-validator";
import User from "../models/User";
import jwt from 'jsonwebtoken'

const router = express.Router();


router.post('/register', (req: Request, res: Response) =>
    {
        const {name, email, password} = req.body;

        try {
         const userExists = await User.findOne({email})
            if (userExists) {
                res.status(400).json({message: 'User exists'})
            }

            const user = new User({name, email, password});
            await user.save();

            const token = jwt.sign({userId: user._id}, 'your_jwt_secret', {expiresIn: '1h'});

            res.status(201).json({token});
        } catch (error) {
            res.status(500).json({message: (error as Error).message});
        }
    })

