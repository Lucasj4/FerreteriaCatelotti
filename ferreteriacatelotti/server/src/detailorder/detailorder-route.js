import express from 'express';
import { DetailOrderController } from './detailorder-controller.js';

const detailOrderController = new DetailOrderController();
export const detailOrderRoute = express.Router();

detailOrderRoute.post('/', detailOrderController.createDetailOrder);
detailOrderRoute.post('/editdetailorderline', detailOrderController.createEditDetailOrderLine);
detailOrderRoute.get('/', detailOrderController.getDetailOrders);
detailOrderRoute.get('/:rowid', detailOrderController.getDetailOrderById);
detailOrderRoute.put('/:rowid', detailOrderController.updateDetailOrderLine);
detailOrderRoute.delete('/:doi' , detailOrderController.deleteDetailOrder);
