import express from 'express';
import { PurchaseOrderController } from './purchaseorder-controller.js';

export const purchaseOrderRouter = express.Router();
const purchaseOrderController = new PurchaseOrderController();

purchaseOrderRouter.get('/', purchaseOrderController.getPurchaseOrders )
purchaseOrderRouter.get('/search', purchaseOrderController.getPurchaseOrdersBySupplierAndDate);
purchaseOrderRouter.post("/", purchaseOrderController.createPurchaseOrder );