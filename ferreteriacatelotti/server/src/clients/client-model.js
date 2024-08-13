import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    clientFirstName: {
      type: String,
      required: true
    },
    clientLastName: {
      type: String,
      required: true
    },
    clientEmail: {
      type: String,
      required: true,
      unique: true
    },
    clientDni: {
      type: String,
      required: true
    }
});


  
const ClientModel = mongoose.model('clients', clientSchema);
  
export default ClientModel;