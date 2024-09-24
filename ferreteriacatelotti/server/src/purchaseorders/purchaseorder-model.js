import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
    purchaseOrderDate: {
      type: Date,
      required: true
    },
    purchaseOrderAmount: {
      type: Number,
      // required: true
    },
    purchaseOrderStatus: {
      type: String,
      required: true
    },
    // userID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'users'
    // },
    supplierID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'suppliers'
    }
  });

const PurchaseOrderModel = mongoose.model('purchaseorders', purchaseOrderSchema);

export default PurchaseOrderModel;
