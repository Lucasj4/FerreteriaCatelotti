import express from 'express';
import { SaleController } from './sale-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';

export const saleRouter = express.Router();
const saleController = new SaleController();

saleRouter.post('/', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.addSale);
saleRouter.get('/', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.getSales);

