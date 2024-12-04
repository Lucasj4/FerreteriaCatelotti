import UserModel from './user-model.js'

export class UserService{
    
    async createUser(user){
        try {
            const newUser = new UserModel(user);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email){
        try {
            const user = await UserModel.findOne({userEmail: email});
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUsers(){
        try {
            const users = await UserModel.find();
            return users
        } catch (error) {
            throw error;
        }
    }

    

    
}