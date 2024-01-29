import express from 'express';
import { budgetRouter } from './routes/budget.js'
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());

const password = encodeURIComponent("39028799lj");
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/detallepedido', budgetRouter);


mongoose.connect("mongodb+srv://lucasfjulia:39028799lj@cluster0.aewbj32.mongodb.net/ferreteria?retryWrites=true&w=majority")
    .then(() => console.log("Conectados a la base de datos"))
    .catch((error) => console.log(error))

app.listen(8080, () => {
    console.log(`Escuchando en el puerto: 8080 `);
})




