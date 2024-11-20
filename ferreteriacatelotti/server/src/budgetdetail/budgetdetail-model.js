import mongoose from "mongoose";

const budgetDetailSchema = new mongoose.Schema({

    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    budgetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'budgets',
        
    },
    budgetDetailUnitCost: {
        type: Number,
        required: true
    },
    budgetDetailQuantity: {
        type: Number,
        required: true
    },
    budgetDetailItem: {
        type: String,
        required: true
    }
})

const BudgetDetaiLModel = mongoose.model("budgetdetails", budgetDetailSchema );

export default BudgetDetaiLModel;