import { UserService } from './user-service.js';
import jwt from 'jsonwebtoken';
import { isValidPassword, createHash } from "../utils/hashBcrypt.js";
import { EmailManager } from '../emailmanager/emailmanager.js';
import { generateResetToken } from '../utils/tokenreset.js';

const userService = new UserService();
const emailController = new EmailManager();

export class UserController {

    async getUsersCount(req, res) {
        try {
            const count = await userService.getUsersCount();
            return res.status(200).json({ count });
        } catch (error) {
            console.error("Error al obtener la cantidad de usuarios:", error);
            res.status(500).json({ error: "Error al obtener la cantidad de usuarios" });
        }
    }
    

    async createUser(req, res) {
        const { userUsername, userPassword, userEmail, userRole, userConfirmPassword } = req.body;

        try {
            const existingUser = await userService.findUserByEmail(userEmail);

            if (existingUser) {
                return res.status(409).json({ error: `El email ${userEmail} ya esta registrado` });
            }

            if(userPassword != userConfirmPassword){
                return res.status(400).json({ message: "La contraseña y la confirmación no coinciden" });
            }
            const hashedPassword = createHash(userPassword);

            const newUser = {
                userUsername,
                userPassword: hashedPassword,
                userEmail,
                userRole
            }

            console.log("Username: ", userUsername);
            console.log("Email: ", userEmail);
            

            try {
                await emailController.sendEmailNewUser(userUsername, userEmail);
            } catch (error) {
                req.logger.error('Error al enviar el correo:', error.message);
                return res.status(500).json({ error: 'No se pudo enviar el correo de bienvenida' });
            }
            req.logger.info("User: " + newUser)
            const user = await userService.createUser(newUser);

            return res.status(201).json({ message: "Usuario registrado con exito", user });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userService.getUsers();

            if (users) {
                return res.status(200).json({ message: "Usuarios", users })
            } else {
                return res.status(404).json({ message: "Usuarios no encontrados" })
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getUserById(req, res){
        const {id} = req.params;

        console.log(id);
        
        try {
            const user = await userService.getUserById(id);

            if(!user){
                return res.status(404).json({message: "Usuario no encontrado"});
            }

            req.logger.info("Usuario: " + user);

            return res.status(200).json({user});
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async loginUser(req, res) {
        const { userUsername, userPassword } = req.body;

        req.logger.info("Usuario: " + userUsername);
        req.logger.info("Contraseña: " + userPassword);
        try {


            const existingUser = await userService.getUserByUsername(userUsername);


            
            
            if (existingUser.length === 0) {
                return res.status(404).json({ message: "Usuario no válido" });
            }

            const user = existingUser[0];

            const validUser = isValidPassword(userPassword, user)


            console.log(validUser);
            
            if (!validUser) {
                return res.status(401).json({ message: "Contraseña incorrecta" });;
            }

            const token = jwt.sign({ user: user }, "ferreteria", {
                expiresIn: "1h"
            });

            console.log("token desde login: ", token);

            if (user) {
                return res
                    .status(200)
                    .cookie("ferreteriaCookieToken", token, {
                        maxAge: 3600000,
                        httpOnly: true,
                        secure: false,

                    })
                    .json({ message: "Login exitoso y cookie establecida", token });
            }


        } catch (error) {
            req.logger.error("ERROR : ", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }

    async getUserRole(req, res) {
        try {
            const token = req.cookies.ferreteriaCookieToken; // Asegúrate de que el token esté en las cookies



            if (!token) {
                return res.status(401).json({ message: "No autenticado" });
            }

            // Verificar el token JWT
            jwt.verify(token, "ferreteria", async (err, decoded) => {
                if (err) {
                    console.log("error: ", err);

                    return res.status(403).json({ message: "Token inválido o expirado" });
                }


                const userToken = decoded.user;


                // El token es válido, ahora obtenemos el usuario
                const userId = decoded.user._id;  // Asumiendo que el id está en el objeto decodificado
                const user = await userService.getUserById(userId);  // Método para obtener el usuario por ID

                if (!user) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }

                // Devolver solo el rol del usuario
                return res.status(200).json({ role: user.userRole });
            });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    async logoutUser(req, res) {
        try {

            res.clearCookie("ferreteriaCookieToken", {
                httpOnly: true,
                secure: false,   // Solo para HTTPS
                sameSite: "strict" // Controla el envío entre sitios
            });

            return res.status(200).json({ message: "Logout exitoso" });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    async updateUser(req, res){
        const {userUsername,  userEmail, userRole} = req.body;
        const{ id } = req.params;

        try {
            
            const updateData = {
                userUsername,
                userEmail,
                userRole
            }

            const updatedUer = await userService.updateUser(id, updateData);

          
            return res.status(200).json({updatedUer});
           

        } catch (error) {
             console.log("Error: ", error);
             
             return res.status(500).json({ message: 'Error en el servidor', error });
        } 
    }
    async deleteUser(req, res) {

        const { id } = req.params

        try {

            const user = await userService.getUserById(id);

            if(user.userRole === "Admin"){
                return res.status(400).json({message: "No se puede eliminar al administrador"})
            }
            const userDelete = await userService.deleteUser(id);

            if (userDelete) {
                res.status(200).json({ message: "Usuario eliminado", userDelete })
            } else {
                res.status(404).json({ message: "Usuario no encontrado" })
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    async requestPasswordReset(req,res){
        const {email} = req.body

        try {
            const user = await userService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({message: "Usuario no encontrado"});
            }

            const token = generateResetToken();

            user.userResetToken= {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };

            req.logger.info("User resetTOken " + user.resetToken);

            await user.save();

            await emailController.sendRestorationEmail(email, user.userUsername, token);

            return res.status(200).json({message: "Email enviado"})

        } catch (error) {
            req.logger.error(error);
            console.log(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { userEmail, userPassword, userToken } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await userService.findUserByEmail(userEmail)

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            req.logger.info("User" + user);
            const resetToken = user.userResetToken;

            await user.save();

            req.logger.info("Reset token: " + resetToken);
            req.logger.info("Token: " + userToken);

            if (!resetToken || resetToken.token !== userToken) {
                return res.status(400).json({message: "El token de restablecimiento de contraseña es inválido"});

            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.status(400).json({message: "Expiro el token para reestablecer"});
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(userPassword, user)) {
                return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior"});
            }

            // Actualizar la contraseña del usuario
            user.userPassword = createHash(userPassword);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            return res.status(200).json({message: "Contraseña reestablecida con exito"});

           
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error});
        }
    }
}