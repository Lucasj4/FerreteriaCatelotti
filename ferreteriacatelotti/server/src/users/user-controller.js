import { UserService } from './user-service.js';
import jwt from 'jsonwebtoken';
import { isValidPassword } from "../utils/hashBcrypt.js";
const userService = new UserService();

export class UserController {



    async createUser(req, res) {
        const { userUsername, userPassword, userEmail, userRole } = req.body;

        try {
            const existingUser = await userService.findUserByEmail(userEmail);

            if (existingUser) {
                return res.status(409).json({ error: `El email ${userEmail} ya esta registrado` });
            }

            const newUser = {
                userUsername,
                userPassword,
                userEmail,
                userRole
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

    async loginUser(req, res) {
        const { userUsername, userPassword } = req.body;
    
        try {
            const existingUser = await userService.getUserByUsername(userUsername);
    
            if (!existingUser) {
                return res.status(401).json({ message: "Usuario no válido" });
            }
    
            const user = existingUser[0];
    
            if (user.userPassword === userPassword) {
                const token = jwt.sign({ user: existingUser }, "ferreteria", { expiresIn: "1h" });
    
                return res
                    .status(200)
                    .cookie("ferreteriaCookieToken", token, {
                        maxAge: 3600000,
                        httpOnly: true,
                        secure: true,   // Solo para HTTPS
                        sameSite: "strict", // Controla el envío entre sitios
                    })
                    .json({ message: "Login exitoso y cookie establecida", token });

            } else {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    async getUserRole(req, res) {
        try {
            const token = req.cookies.ferreteriaCookieToken; // Asegúrate de que el token esté en las cookies

            console.log("token: ", token);
            
            if (!token) {
                return res.status(401).json({ message: "No autenticado" });
            }

            // Verificar el token JWT
            jwt.verify(token, "ferreteria", async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Token inválido o expirado" });
                }

               
                const userToken = decoded.user[0];
                console.log("user token: ", userToken);
                
                // El token es válido, ahora obtenemos el usuario
                const userId = decoded.user[0]._id;  // Asumiendo que el id está en el objeto decodificado
                const user = await userService.getUserById(userId);  // Método para obtener el usuario por ID
                console.log("User: ", user);
                if (!user) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }

                // Devolver solo el rol del usuario
                return res.status(200).json({ role: user.userRole});
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
                secure: true,   // Solo para HTTPS
                sameSite: "strict" // Controla el envío entre sitios
            });
    
            return res.status(200).json({ message: "Logout exitoso" });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}