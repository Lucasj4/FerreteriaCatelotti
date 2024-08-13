import {UserService} from './user-service.js';
import jwt from 'jsonwebtoken';
import { isValidPassword } from "../utils/hashBcrypt.js";
const userService = new UserService();

export class UserController{
    
    async login(req, res) {

        const { email, password } = req.body;
        
        try {
            const existingUser = await userService.findUserByEmail(email);


            if (!existingUser) {
                return res.status(401).send("Usuario no válido");
            }
            const validUser = isValidPassword(password, existingUser)

            if (!validUser) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: existingUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            
        } catch (error) {
            req.logger.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async createUser(req, res){
        const {clientName} = req.body;
    }
  
}