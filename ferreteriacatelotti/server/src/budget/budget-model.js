import mongoose  from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      // required: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clients',
      required: true
    },
    budgetDate: {
      type: Date,
      required: true
    },
    budgetAmount: {
      type: Number,
      required: true
    },
    budgetStatus: {
      type: String,
      required: true
    }
  });

const BudgetModel = mongoose.model('budgets', budgetSchema);

export default BudgetModel;  




