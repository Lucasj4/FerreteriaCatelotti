import express from 'express';
import cors from 'cors';
import './database.js'
import { productRouter } from './src/products/product-router.js';
import { supplierRouter } from './src/suppliers/supplier-router.js';
import { unitRouter } from './src/units/unit-router.js';
import { addLogger } from './src/utils/logger.js';
import { categoryRouter } from './src/categories/catregory-router.js';
import { clientRouter } from './src/clients/client-router.js';
import errorHandler from './src/middlewares/errormiddleware.js';
const app = express();

app.use(express.json());
app.use(addLogger)

app.use(express.urlencoded({ extended: true }));
app.use(cors())





app.use("/api/products", productRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/units", unitRouter);
app.use("/api/clients", clientRouter);
app.use("/api/categories", categoryRouter);
app.use(errorHandler);



app.listen(8080, () => {
    console.log(`Servidor en ejecución en http://localhost:8080`);
})