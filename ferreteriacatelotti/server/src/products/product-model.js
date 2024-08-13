import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productStock: {
    type: Number,
    required: true
  },
  productCost: {
    type: Number,
    required: true
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  unitID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'units',
    required: true
  },
  productCode: {
    type: String,
    required:true
  }
});

const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;
