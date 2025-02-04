import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;  // Usamos la variable de entorno


mongoose.connect(MONGO_URI)
    .then(() => { console.log("Conexión exitosa") })
    .catch((error) => console.log(`Error: ${error}`));