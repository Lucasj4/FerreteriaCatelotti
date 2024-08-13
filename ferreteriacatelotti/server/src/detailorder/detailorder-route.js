import express from 'express';
import { DetailOrderController } from './detailorder-controller.js';

const detailOrderController = new DetailOrderController();
export const detailOrderRoute = express.Router();

detailOrderRoute.post('/', detailOrderController.createDetailOrder);
detailOrderRoute.get('/', detailOrderController.getDetailOrders);
