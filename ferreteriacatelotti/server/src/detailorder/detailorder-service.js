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

    async createEditDetailOrderLine(detailOrder){
        try {
            const newDetailOrder = new DetailOrderModel(detailOrder);
            return await newDetailOrder.save();
        } catch (error) {
            console.log(error);
            throw error;
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