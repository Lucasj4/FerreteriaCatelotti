import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    saleDate: { type: Date, required: true },
    // invoiceType: { type: String, required: true },
    saleTotalAmount: { type: Number, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clients',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'budgets',
        required: true
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            quantity: { type: Number, required: true },
            salePrice: { type: Number, required: true },
        }
    ]
})

const SaleModel = mongoose.model('sales', saleSchema);
  
export default SaleModel;