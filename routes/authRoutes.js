import express from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';
import signInMiddleware from '../middlewares/signInMiddleware.js';
import signUpMiddleware from '../middlewares/signUpMiddleware.js';

const authRoutes = express.Router();
authRoutes.post("/sign-up", signUpMiddleware, signUp);
authRoutes.post("/sign-in", signInMiddleware, signIn); 

export default authRoutes;