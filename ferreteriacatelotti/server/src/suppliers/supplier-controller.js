import { SupplierService } from "./supplier-service.js";
import PurchaseOrderModel from "../purchaseorders/purchaseorder-model.js";
const supplierService = new SupplierService();

export class SupplierController {
    
    async getSuppliersCount(req, res) {
        try {
            const count = await supplierService.getSuppliersCount();
            return res.status(200).json({ count });
        } catch (error) {
            console.error("Error al obtener la cantidad de proveedores:", error);
            res.status(500).json({ error: "Error al obtener la cantidad de proveedores" });
        }
    }
    
   
    async addSupplier(req, res){
        const { supplierFirstName, supplierLastName, supplierEmail, supplierDni } = req.body;
        
        
        try {
        
            const existingSupplier = await supplierService.getByDni(supplierDni);
            const existingSupplierEmail = await supplierService.getSupplierByEmail(supplierEmail);

            req.logger.info("Email: " + existingSupplierEmail)
    
            if(existingSupplier){
                return res.status(409).json({ error: "Ya existe un proveedor con el mismo dni" });
            }

            if(existingSupplierEmail){
                return res.status(409).json({ error: "Ya existe un proveedor con el email que intenta registrar" });
            }



            const newSupplier = {
                supplierFirstName,
                supplierLastName,
                supplierEmail,
                supplierDni
            }
            console.log("New Supplier: ", newSupplier);
            await supplierService.addSupplier(newSupplier);
            res.status(200).json({ message: 'Supplier added successfully', supplier: newSupplier });
        } catch (error) {
            throw error;
        }  
    }

    async getSuppliers(req,res){
        try {
            const suppliers = await supplierService.getSuppliers();

            if(suppliers){
                return res.status(200).json({message: "Proveedores", suppliers})
            }else{
                return res.status(404).json({message: "Proveedores no encontrado"})
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getSupplierById(req, res) {
        const { id } = req.params;

        req.logger.info("id supplier: " + id)
        try {
            const supplier = await supplierService.getById(id);

            console.log("Supplier: ", supplier);
            
            if (!supplier) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            return res.status(200).json({ message: 'Proveedor encontrado', supplier });
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async getSuppliersByFilter(req, res){
        const {name, lastname} = req.query;

        req.logger.info("Nombre: " + name);
        req.logger.info("Apellido proveedor: " + lastname);

        try {
            const suppliers = await supplierService.getSuppliersByFilter(name, lastname);

            console.log("Suppliers: ", suppliers);
            
            if(!suppliers.length){
                return res.status(404).json({message: "Proveedores no encontrados"});
            }

            if(suppliers){
                return res.status(200).json({suppliers});

            }
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async updateSupplier(req, res){
        const {id} = req.params;
        const {supplierFirstName, supplierLastName, supplierDni, supplierEmail} = req.body;

        req.logger.info("Supplier id: " + id);

        const updateData = {
            supplierFirstName,
            supplierLastName,
            supplierDni,
            supplierEmail
        }
        try {

            const supplier = await supplierService.getById(id);

            if(!supplier){
                return res.status(404).json({message: "Proveedor no encontrado"})
            }

            const updatedSupplier = await supplierService.updateSupplier(id, updateData);

            return res.status(200).json({updatedSupplier});

        
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async deleteSupplier(req, res){
        const {id} = req.params;

        try {

            const supplierInOrder = await PurchaseOrderModel.findOne({supplierID: id});

            if(supplierInOrder){
                return res.status(400).json({message: "No se puede eliminar un proveedor asociado a un pedido de compra"})
            }


            const deletedSupplier = await supplierService.deleteSupplierById(id);

            return deletedSupplier;
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }
   

}
