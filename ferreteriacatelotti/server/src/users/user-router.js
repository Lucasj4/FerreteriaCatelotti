import express from 'express';
import { UserController } from './user-controller.js';
import { userValidator } from './user-validator.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';
export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/", userValidator, authMiddleware, checkUserRole(["Admin"]),  userController.createUser );
userRouter.post("/login",  userController.loginUser );
userRouter.post('/logout', userController.logoutUser);
userRouter.post('/requestresetpassword', userController.requestPasswordReset);
userRouter.post('/resetpassword', userController.resetPassword);
userRouter.get("/", authMiddleware, checkUserRole(["Admin"]), userController.getUsers);
userRouter.get("/rol",  userController.getUserRole);
userRouter.get("/search", authMiddleware, checkUserRole(["Admin"]), userController.getUserByFilter);
userRouter.get("/:id", authMiddleware, checkUserRole(["Admin"]),  userController.getUserById);
userRouter.put('/:id', userValidator, authMiddleware, checkUserRole(["Admin"]), userController.updateUser);
userRouter.delete('/:id', authMiddleware, checkUserRole(["Admin"]), userController.deleteUser);
 