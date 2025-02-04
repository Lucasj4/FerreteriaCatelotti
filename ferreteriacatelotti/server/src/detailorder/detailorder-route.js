import express from 'express';
import { DetailOrderController } from './detailorder-controller.js';
import {validateDetailOrder} from './detailorder-validator.js'
const detailOrderController = new DetailOrderController();
export const detailOrderRoute = express.Router();

detailOrderRoute.post('/', validateDetailOrder, detailOrderController.createDetailOrder);
detailOrderRoute.post('/editdetailorderline', validateDetailOrder, detailOrderController.createEditDetailOrderLine);
detailOrderRoute.get('/', detailOrderController.getDetailOrders);
detailOrderRoute.get('/:rowid', detailOrderController.getDetailOrderById);
detailOrderRoute.put('/:rowid', validateDetailOrder, detailOrderController.updateDetailOrderLine);
detailOrderRoute.delete('/:doi' , detailOrderController.deleteDetailOrder);
