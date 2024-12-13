import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) => {
    console.log("Contrase;a de usuario: ", user.userPassword);
    console.log("Contrase;a: ", password);
    
    const isValid = bcrypt.compareSync(password.trim(), user.userPassword.trim());
   
    return isValid;
}