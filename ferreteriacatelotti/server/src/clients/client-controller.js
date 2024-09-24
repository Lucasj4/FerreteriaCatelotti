import { ClientService } from "./client-service.js";

const clientService = new ClientService();

export class ClientController {

    async addCliente(req, res) {
        const { clientFirstName, clientLastName, clientEmail, clientDni } = req.body;

        try {
            const existingClient = await clientService.getClientByDni(clientDni);

            if (existingClient) {
                return res.status(409).json({ error: `El client ${clientFirstName} ${clientLastName} ya existe` });
            }

            const newClient = {
                clientFirstName,
                clientLastName,
                clientEmail,
                clientDni
            }

            const client = await clientService.addClient(newClient);
            return res.status(201).json({ message: "Client agregado", client });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getClients(req, res) {
        try {
            const clients = await clientService.getClients();
            if (clients) {
                return res.status(200).json({ clients });
            } else {
                return res.status(404).json({ message: "Clientes no encontrados" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getClientById(req,res){
        const { cid } = req.params;

        try {
            req.logger.info("iD CLIENTE: " + cid);
            
            const client = await clientService.getClientById(cid);
            
            if(!client){
                return res.status(404).json({message: "Cliente no encontrado"})
            }

            return res.status(200).json({client})
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async updateClient(req, res) {
        const { cid } = req.params;
        const  clientData  = req.body;
        req.logger.info("Datos recibidos desde el frontend: ", req.body);

        try {
            req.logger.info("cid: " + cid);
            
            const existingClient = await clientService.getClientById(cid);
            
            if (!existingClient) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            req.logger.info("Cliente: " + existingClient);

           
            // Actualizar el cliente
            const client = await clientService.updateClient(cid, clientData);

            req.logger.info("Cliente modificado: " + client);
            // Devolver la respuesta si se actualiza correctamente
            if (client) {
                return res.status(200).json({ message: 'Cliente editado con éxito', client, existingClient });
            } else {
                return res.status(400).json({ error: 'Error al actualizar el cliente' });
            }


        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}