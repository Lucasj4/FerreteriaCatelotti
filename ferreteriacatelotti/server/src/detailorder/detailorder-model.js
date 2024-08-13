import mongoose from 'mongoose';

const detailOrderSchema = new mongoose.Schema({
 
  item: {
    type: String,
    required: true
  },
  unitCost: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }
});




const DetailOrderModel = mongoose.model('DetailOrder', detailOrderSchema);

export default DetailOrderModel;