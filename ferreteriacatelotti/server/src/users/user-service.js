import UserModel from './user-model.js'

export class UserService {

    async createUser(user) {
        try {
            const newUser = new UserModel(user);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ userEmail: email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUsers() {
        try {
            const users = await UserModel.find();
            return users
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            const user = await UserModel.find({ userUsername: username });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id);
            return user
        } catch (error) {
            throw error;
        }
    }

    async getUserByFilter(username) {
        try {
            const query = {};

            if (username && username.trim()) { // Asegúrate de que el username no esté vacío o solo tenga espacios
                query.userUsername = { $regex: username, $options: 'i' }; // Caso sensible a mayúsculas/minúsculas
            }

            const users = await UserModel.find(query).exec();  // Verifica que esto devuelva los resultados correctamente
            console.log("Usuarios encontrados:", users);  // Verifica que el arreglo de usuarios esté correcto

            return users;// Retorna los usuarios encontrados
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const deleteUser = await UserModel.findByIdAndDelete(id);
            return deleteUser;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(idUser, updateData) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(idUser, updateData);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }




}