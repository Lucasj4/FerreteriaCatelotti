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

    async getDetailOrderById(id){
        try {
            const detailOrder = await DetailOrderModel.findById(id);
            return detailOrder;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateDetailOrderLine(detailOrderId, updateDetailOrder){
        try {
            const updateDetailOrderLine = await DetailOrderModel.findByIdAndUpdate(detailOrderId, updateDetailOrder, { new: true } );
            return updateDetailOrderLine;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async updateDetailOrderQuantity(detailOrderId, detailOrderQuantity){
        try {
            const updateDetailOrder = await DetailOrderModel.findByIdAndUpdate(detailOrderId, {detailOrderQuantity: detailOrderQuantity}, { new: true } );
            return updateDetailOrder;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async deleteDetailOrder(id){
        try {
            const detailOderDelete = await DetailOrderModel.findByIdAndDelete(id);
            return detailOderDelete;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async findByOrderIdandProductName(purchaseOrderId, productName){
        try {
            const detailOrder = await DetailOrderModel.findOne({
                purchaseOrderID: purchaseOrderId,
                detailOrderProduct: productName
            })

            return detailOrder;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }




    
}