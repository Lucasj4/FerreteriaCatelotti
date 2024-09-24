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

            const token = jwt.sign({ user: existingUser }, "ferreteria", {
                expiresIn: "1h"
            });

            res.cookie("ferreteriaCatelotti", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            
        } catch (error) {
            req.logger.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async createUser(req, res){
        const {userUsername, userPassword, userEmail} = req.body;

        try {
            const existingUser = await userService.findUserByEmail(userEmail);

            if(existingUser){
                return res.status(409).json({ error: `El email ${userEmail} ya esta registrado` });
            }

            const newUser = {
                userUsername,
                userPassword,
                userEmail
            }

            req.logger.info("User: " + newUser)
            const user = await userService.createUser(newUser);

            return res.status(201).json({message: "Usuario registrado con exito", user});
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
  
}