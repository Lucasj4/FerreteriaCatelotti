import express from 'express';
import { SupplierController } from './supplier-controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { checkUserRole } from '../middlewares/checkrole.js';
import { ValidateSupplier } from './supplier-validator.js';
const supplierController = new SupplierController();

export const supplierRouter = express.Router();

supplierRouter.post('/', authMiddleware, checkUserRole(["Admin", "Dueño"]), ValidateSupplier, supplierController.addSupplier);
supplierRouter.get('/search' , authMiddleware, checkUserRole(["Admin", "Dueño"]), supplierController.getSuppliersByFilter);
supplierRouter.get('/',  authMiddleware, checkUserRole(["Admin", "Dueño"]),supplierController.getSuppliers);
supplierRouter.put('/:id', authMiddleware, checkUserRole(["Admin", "Dueño"]), ValidateSupplier, supplierController.updateSupplier);
supplierRouter.delete('/:id',authMiddleware, checkUserRole(["Admin", "Dueño"]), supplierController.deleteSupplier);
supplierRouter.get('/:id',authMiddleware, checkUserRole(["Admin", "Dueño"]), supplierController.getSupplierById);