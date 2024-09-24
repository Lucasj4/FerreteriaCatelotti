import mongoose  from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    clientID: {
      type: Schema.Types.ObjectId,
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

const BudgetModel = mongoose.Model('budgets', budgetSchema);

export default BudgetModel;




