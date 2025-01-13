import express from 'express';
import { PurchaseOrderController } from './purchaseorder-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';
import {ValidatePurchaseOrder} from "./purchaseorder-validator.js"
export const purchaseOrderRouter = express.Router();
const purchaseOrderController = new PurchaseOrderController();

purchaseOrderRouter.get('/', authMiddleware, checkUserRole(["Admin", "Dueño"]),   purchaseOrderController.getPurchaseOrders );
purchaseOrderRouter.get('/search', authMiddleware, checkUserRole(["Admin", "Dueño"]),  purchaseOrderController.getPurchaseOrdersBySupplierAndDate);
purchaseOrderRouter.post("/", authMiddleware, checkUserRole(["Admin", "Dueño"]),ValidatePurchaseOrder,purchaseOrderController.createPurchaseOrder );
purchaseOrderRouter.post("/factura", purchaseOrderController.printPurchaseOrder)
purchaseOrderRouter.get('/purchaseorderswithdetails/:pid', authMiddleware, checkUserRole(["Admin", "Dueño"]),purchaseOrderController.getPurchaseOrderWithDetails )
purchaseOrderRouter.get('/:id', authMiddleware, checkUserRole(["Admin", "Dueño"]),   purchaseOrderController.getPurchaseOrderById);
purchaseOrderRouter.put('/:id', authMiddleware, checkUserRole(["Admin", "Dueño"]), purchaseOrderController.updatePurchaseOrder);
purchaseOrderRouter.delete('/:id', authMiddleware, checkUserRole(["Admin", "Dueño"]),purchaseOrderController.deletePurchaseOrder);