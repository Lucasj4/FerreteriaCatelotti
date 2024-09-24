import mongoose from 'mongoose';

const detailOrderSchema = new mongoose.Schema({
  detailOrderProduct: {
    type: String,
    required: true
  },
  detailOrderUnitCost: { 
    type: Number,
    required: true
  },
  detailOrderQuantity: {  
    type: Number,
    required: true
  },
  productID: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required:true
  },
  purchaseOrderID: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'purchaseOrders',
    
  }
});




const DetailOrderModel = mongoose.model('DetailOrder', detailOrderSchema);

export default DetailOrderModel;