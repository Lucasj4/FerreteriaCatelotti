import mongoose from 'mongoose';


const db = mongoose;
const purchaseOrderCollection = 'DetallesPedidosCompras';

const purchaseOrderSchema = new db.Schema({
    articulo: String,
    cantidad: Number,
    precioUnitario: Number,
    unidad: String,
    fecha: Date,
    subTotal: Number,
    proveedor: String

})



export class purchaseOrderModel {
    constructor() {
        this.PurchaseOrder = mongoose.model(purchaseOrderCollection, purchaseOrderSchema);
    }

    async createOrder(data) {
        try {
            const newOrder = new this.PurchaseOrder(data);
            return await newOrder.save();
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const allOrders = await this.PurchaseOrder.find();
            return allOrders;
        } catch (error) {
            throw error;
        }
    }
}

export default mongoose.model(purchaseOrderCollection, purchaseOrderSchema);
