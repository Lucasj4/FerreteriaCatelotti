import express from 'express'
import { ClientController } from './client-controller.js'
import { validateClient } from './client-validator.js';
const clientController = new ClientController();
export const clientRouter = express.Router();

clientRouter.get('/count', clientController.getClientsCount);
clientRouter.post('/', validateClient, clientController.addCliente);
clientRouter.get('/', clientController.getClients);
clientRouter.get('/search' , clientController.getClientByFilter);
clientRouter.delete('/:id', clientController.deleteClient);
clientRouter.put('/:cid',validateClient, clientController.updateClient);
clientRouter.get('/:cid', clientController.getClientById);