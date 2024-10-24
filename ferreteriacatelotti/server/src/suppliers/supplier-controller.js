import { SupplierService } from "./supplier-service.js";

const supplierService = new SupplierService();

export class SupplierController {
   
    async addSupplier(req, res){
        const { firstName, lastName, email, dni } = req.body;
       
        try {
            if (!firstName || !lastName || !email || !dni) {
                return res.status(400).json({ message: 'Missing required fields: firstname, lastname, email, or dni' });
            }
        
            const existingSupplier = await supplierService.getByDni(dni);
    
            if(existingSupplier){
                return res.status(409).json({ error: "Ya existe un proveedor con el mismo dni" });
            }

            const newSupplier = {
                firstName,
                lastName,
                email,
                dni
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

        try {
            const supplier = await supplierService.getById(id);

            if (!supplier) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            return res.status(200).json({ message: 'Proveedor encontrado', supplier });
        } catch (error) {
            return res.status(500).json({ message: 'Error en el servidor', error });
        }
    }
   

}
