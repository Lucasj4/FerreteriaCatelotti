import express from 'express';
import { SaleController } from './sale-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';

export const saleRouter = express.Router();
const saleController = new SaleController();

saleRouter.get('/count', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.getSalesCount);
saleRouter.post('/', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.addSale);
saleRouter.post('/printinvoice', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.printInvoiceSale);
saleRouter.get('/', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.getSales);
saleRouter.get('/search', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.getSalesByFilter);
saleRouter.get('/:sid', authMiddleware, checkUserRole(['Admin', 'Dueño']), saleController.getSalesById);