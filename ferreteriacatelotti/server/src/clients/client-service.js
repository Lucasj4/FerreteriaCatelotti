import ClientModel from './client-model.js'

export class ClientService {

    async addClient(data){
        try {
            const newClient = new ClientModel(data);
            return await newClient.save();
        } catch (error) {
            throw error
        }
    }
    
    async getClientByDni(dni) {
        try {
            const client = await ClientModel.findOne({clientDni: dni});
            return client;
        } catch (error) {
            throw error;
        }
    }

    async getClientById(id){
        try {
            const client = await ClientModel.findOne({_id: id});
            return client;
        } catch (error) {
            throw error;
        }
    }

    async updateClient(clientId, clientData){
        try {
            const updateClient = await ClientModel.findByIdAndUpdate(clientId, clientData);
            return updateClient;
        } catch (error) {
            throw error;
        }
    }

    async getClients(){
        try {
            const users = await ClientModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getClientByEmail(clientEmail){
        try {
            const client = await ClientModel.findOne({clientEmail: clientEmail});
            return client;
        } catch (error) {
            throw error;
        }
    }

    async getClientByFilter(clientEmail, clientLastName){
        try {
            const query = {};

            if(clientEmail){
                query.clientEmail = clientEmail;
            }

            if(clientLastName){
                query.clientLastName = clientLastName
            }

            return await ClientModel.find(query).exec();
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
}