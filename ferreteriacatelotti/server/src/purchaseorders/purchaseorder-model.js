import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    supplierID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'suppliers'
    }
  });

const PurchaseOrderModel = mongoose.model('purchaseorders', purchaseOrderSchema);

export default PurchaseOrderModel;
