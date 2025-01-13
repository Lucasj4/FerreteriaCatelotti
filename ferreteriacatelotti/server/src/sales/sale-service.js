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
                const parsedStartDate = new Date(startDate);
                parsedStartDate.setUTCHours(0, 0, 0, 0); // Comienza el día en UTC 00:00:00
            
                const parsedEndDate = new Date(endDate);
                parsedEndDate.setUTCHours(23, 59, 59, 999); // Termina el día en UTC 23:59:59
            
                console.log("Parsed startDate:", parsedStartDate); // Loguea para verificar
                console.log("Parsed endDate:", parsedEndDate); // Loguea para verificar
            
                query.saleDate = {
                    $gte: parsedStartDate,
                    $lte: parsedEndDate,
                };
            }
    
            // Encuentra las ventas aplicando solo los filtros disponibles.
            const sales = await SaleModel.find(query)
                .populate('clientId', 'clientLastName')
                .populate('userId', 'userUsername')
                .exec();
    
            
            return sales;
    
        } catch (error) {
            console.error("Error en el servicio de ventas", error);
            throw new Error("Error al buscar las ventas");
        }
    }

    async getSaleById(id){
        try {
            const sale = await SaleModel.findById(id).populate('clientId', 'clientLastName').populate('userId', 'userUsername').exec();
            return sale;

        } catch (error) {
            console.error("Error en el servicio de ventas", error);
            throw new Error("Error al buscar las ventas");
        }
    }

}