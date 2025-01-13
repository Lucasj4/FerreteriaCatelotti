import express from 'express';
import { SaleController } from './sale-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';

export const saleRouter = express.Router();
const saleController = new SaleController();

saleRouter.post('/', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.addSale);
saleRouter.post('/printinvoice', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.printInvoiceSale);
saleRouter.get('/', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.getSales);
saleRouter.get('/search', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.getSalesByFilter);
saleRouter.get('/:sid', authMiddleware, checkUserRole(['Admin', 'Empleado']), saleController.getSalesById);

