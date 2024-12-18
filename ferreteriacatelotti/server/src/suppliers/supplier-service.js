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
            return supplier.supplierLastName; 
        } catch (error) {
            throw error;
        }
    }

    async getSuppliers(){
        try {
            const suppliers = await SupplierModel.find();
            return suppliers;
        } catch (error) {
            throw error;
        }
    }
}