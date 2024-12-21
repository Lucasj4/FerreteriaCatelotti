import express from 'express';
import cors from 'cors';
import './database.js'
import passport from "passport";
import { productRouter } from './src/products/product-router.js';
import { supplierRouter } from './src/suppliers/supplier-router.js';
import { unitRouter } from './src/units/unit-router.js';
import { addLogger } from './src/utils/logger.js';
import { categoryRouter } from './src/categories/catregory-router.js';
import { clientRouter } from './src/clients/client-router.js';
import errorHandler from './src/middlewares/errormiddleware.js';
import { userRouter } from './src/users/user-router.js';
import { detailOrderRoute } from './src/detailorder/detailorder-route.js';
import { purchaseOrderRouter } from './src/purchaseorders/purchaseorder-route.js';
import { budgetRouter } from './src/budget/budget-router.js';
import { budgetDetailRouter } from './src/budgetdetail/budgetdetail-route.js';
import cookieParser from 'cookie-parser';
import { initializePassport } from "./src/config/passport.config.js";
import {authMiddleware} from './src/middlewares/authmiddleware.js';
import { saleRouter } from './src/sales/sale-router.js';


const app = express();

app.use(express.json());
app.use(addLogger)
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", // Dominio del frontend
    credentials: true,              // Permite enviar cookies
  }));


app.use(passport.initialize());

// app.use(authMiddleware);
app.use("/api/products", productRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/units", unitRouter);
app.use("/api/clients", clientRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/purchaseorders", purchaseOrderRouter);
app.use("/api/detailsorder", detailOrderRoute)
app.use('/api/budgets', budgetRouter)
app.use('/api/budgetsdetails', budgetDetailRouter)
app.use('/api/sales', saleRouter)
app.use(authMiddleware);
app.use(errorHandler);

initializePassport();


app.listen(8080, () => {
    console.log(`Servidor en ejecución en http://localhost:8080`);
})