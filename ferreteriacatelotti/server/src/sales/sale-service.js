import SaleModel from "./sales-model.js";

export class SaleService {

    async addSale(data) {
        try {
            const newSale = new SaleModel(data);
            return await newSale.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async getSales() {
        try {
            const sales = await SaleModel.find().populate('clientId', 'clientLastName').populate('userId', 'userUsername');
            return sales
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getSalesByFilter(clientId, userId, startDate, endDate) {
        try {
            const query = {};
        

            if (clientId && Array.isArray(clientId) && clientId.length > 0) {
                query.clientId = { $in: clientId }; // Filtra por los IDs de cliente seleccionados
            } else if (clientId) {
                query.clientId = clientId; // Si solo hay un cliente, no es necesario el operador $in
            }


            if (userId) {
                query.userId = userId; // Filtra por el estado del presupuesto
            }

            if (startDate && endDate) {
                query.saleDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }; // Filtrar por rango de fechas
            }

            const sales = await SaleModel.find(query).populate('clientId', 'clientLastName').populate('userId', 'userUsername').exec();

            console.log("SALES: ", sales);
            

         
            return sales;
        } catch (error) {
            console.error("Error en el servicio de ventas", error);
            throw new Error("Error al buscar las ventas");
        }
    }

}