import { ClientService } from "./client-service.js";

const clientService = new ClientService();

export class ClientController{
    
    async addCliente(req,res){
        const{clientFirstName, clientLastName, clientEmail, clientDni} = req.body;

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

    async getClients(req, res){
        try {
            const clients = await clientService.getClients();
            if(clients){
                return res.status(200).json({clients});
            }else{
                return res.status(404).json({message: "Clientes no encontrados"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}