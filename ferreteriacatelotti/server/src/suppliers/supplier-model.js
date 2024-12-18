import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    supplierFirstName: {
        type: String,
        required: true
    },
    supplierLastName: {
        type: String,
        required: true
    },
    supplierEmail: {
        type: String,
        required: true,
        unique: true
    },
    supplierDni: {
        type: Number,
        required: true
    }
});

const SupplierModel = mongoose.model('suppliers', supplierSchema);

export default SupplierModel;
