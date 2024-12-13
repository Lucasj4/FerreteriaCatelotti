import express from 'express';
import { SupplierController } from './supplier-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';

const supplierController = new SupplierController();

export const supplierRouter = express.Router();

supplierRouter.post('/', authMiddleware, checkUserRole(["Admin", "Dueño"]), supplierController.addSupplier);
supplierRouter.get('/',  authMiddleware, checkUserRole(["Admin", "Dueño"]),supplierController.getSuppliers);
supplierRouter.get('/:id',authMiddleware, checkUserRole(["Admin", "Dueño"]), supplierController.getSupplierById);