import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userUsername: {
    type: String,
    required: true
  },
  userPassword: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userRole: {
    type: String,

  },
  userResetToken: {
    token: String,
    expiresAt: Date
  },
});

// Modelo de usuario
const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
