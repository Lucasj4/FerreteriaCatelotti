import SupplierModel from "./supplier-model.js";

export class SupplierService{
    
    async addSupplier(data){
        try {
            const newSupplier = new SupplierModel(data);
            return await newSupplier.save();
        } catch (error) {
            throw error
        }
    }

    async getByDni(dni){
        try {
            const supplier = await SupplierModel.findOne({dni: dni});
            return supplier; 
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            const supplier = await SupplierModel.findOne({_id: id});
            return supplier.lastName; 
        } catch (error) {
            throw error;
        }
    }
}