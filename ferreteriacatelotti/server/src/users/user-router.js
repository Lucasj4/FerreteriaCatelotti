import express from 'express';
import { UserController } from './user-controller.js';
import { userValidator } from './user-validator.js';
export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/", userValidator, userController.createUser );
userRouter.post("/login",  userController.login );
