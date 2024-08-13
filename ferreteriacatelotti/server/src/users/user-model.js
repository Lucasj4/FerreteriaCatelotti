import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roleID: {
    type: Schema.Types.ObjectId,
    ref: 'roles'
  }
});

// Modelo de usuario
const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
