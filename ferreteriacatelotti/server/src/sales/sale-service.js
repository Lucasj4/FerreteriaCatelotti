import SaleModel from "./sales-model.js";

export class SaleService {

    async addSale(data){
        try {
            const newSale = new SaleModel(data);
            return await newSale.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async getSales(){
        try {
            const sales = await SaleModel.find().populate('clientId', 'clientLastName').populate('userId', 'userUsername');
            return sales
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}