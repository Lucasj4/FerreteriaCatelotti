import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dni: {
        type: Number,
        required: true
    }
});

const SupplierModel = mongoose.model('suppliers', supplierSchema);

export default SupplierModel;
