import express from 'express';
import { SupplierController } from './supplier-controller.js';

const supplierController = new SupplierController();

export const supplierRouter = express.Router();

supplierRouter.post('/', supplierController.addSupplier);
supplierRouter.get('/', supplierController.getSuppliers);
supplierRouter.get('/:id', supplierController.getSupplierById);