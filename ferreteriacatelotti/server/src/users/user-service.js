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