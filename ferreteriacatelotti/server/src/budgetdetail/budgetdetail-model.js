import mongoose from "mongoose";

const budgetDetailSchema = new mongoose.Schema({

    productID: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    budgetID: {
        type: Schema.Types.ObjectId,
        ref: 'budgets',
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    item: {
        type: String,
        required: true
    }
})

const BudgetDetaiLModel = mongoose.model("budgetdetails", budgetDetailSchema );

export default BudgetDetaiLModel;