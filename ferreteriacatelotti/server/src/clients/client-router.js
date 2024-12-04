import express from 'express'
import { ClientController } from './client-controller.js'
import { validateClient } from './client-validator.js';
const clientController = new ClientController();
export const clientRouter = express.Router();

clientRouter.post('/', validateClient, clientController.addCliente);
clientRouter.get('/', clientController.getClients);
clientRouter.get('/search' , clientController.getClientByFilter);
clientRouter.put('/:cid',validateClient, clientController.updateClient);
clientRouter.get('/:cid', clientController.getClientById);