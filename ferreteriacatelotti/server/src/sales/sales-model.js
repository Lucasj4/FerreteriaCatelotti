import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    saleDate: { type: Date, required: true },
    // invoiceType: { type: String, required: true },
    saleTotalAmount: { type: Number, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clients'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const SaleModel = mongoose.model('sales', saleSchema);
  
export default SaleModel;;