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
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  });

const BudgetModel = mongoose.Model('budgets', budgetSchema);

export default BudgetModel;




