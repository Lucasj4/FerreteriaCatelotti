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
            return supplier; 
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

    async getSuppliersByFilter(supplierName, supplierLastName){
        try {
            const query = {};

            if(supplierName){
                query.supplierFirstName = { $regex: supplierName, $options: 'i' };
            };

            if(supplierLastName){
                query.supplierLastName = { $regex: supplierLastName, $options: 'i' };
            };

            const suppliers = await SupplierModel.find(query).exec();

            return suppliers;

        } catch (error) {
            throw error;
        }
    }

    async updateSupplier(supplierId, updateData){
        try {
            const updatedSupplier = await SupplierModel.findByIdAndUpdate(supplierId, updateData);
            return updatedSupplier;
        } catch (error) {
            throw error;
        }
    }

    async deleteSupplierById(id){
        try {
            const deletedSupplier = await SupplierModel.findByIdAndDelete(id);
            return deletedSupplier;
        } catch (error) {
            throw error;
        }
    }
}