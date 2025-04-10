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
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ferreteria-catelotti.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());
app.use(addLogger)
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());



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
app.use(errorHandler);
app.use(authMiddleware);



const port = process.env.PORT || 8080; 


app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});