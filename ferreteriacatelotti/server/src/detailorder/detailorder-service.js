import DetailOrderModel from "./detailorder-model.js";

export class DetailOrderService{
    
    async createDetailOrder(detailOrder){
        try {
            const newDetailOrder = new DetailOrderModel(detailOrder);
            return await newDetailOrder.save();
        } catch (error) {
            console.log(error);
        }
    }

    async getDetailsOrdes(){
        try {
            return await DetailOrderModel.find()
        } catch (error) {
            console.log(error);
        }
    }
}