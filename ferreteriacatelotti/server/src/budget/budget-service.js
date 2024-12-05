import BudgetModel from "./budget-model.js";
import BudgetDetailModel from '../budgetdetail/budgetdetail-model.js'
import mongoose from "mongoose";

export class BudgetService {

    async createBudget(data) {
        try {
            const newBudget = new BudgetModel(data);
            return await newBudget.save()

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getBudgets() {
        try {
            const budgets = await BudgetModel.find().populate('clientId', 'clientLastName');
            
            return budgets;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const deletedBudget = await BudgetModel.findByIdAndDelete(id);

            if (!deletedBudget) {
                throw new Error(`Presupuesto con ID ${id} no encontrado`);
            }

            return { message: "Presupuesto eliminado correctamente", deletedBudget };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async searchBudgets(clientId, budgetStatus) {
        try {
            const query = {};

            if (clientId && Array.isArray(clientId) && clientId.length > 0) {
                query.clientId = { $in: clientId }; // Filtra por los IDs de cliente seleccionados
              } else if (clientId) {
                query.clientId = clientId; // Si solo hay un cliente, no es necesario el operador $in
              }

              console.log("Client id: ", clientId);
              

            if (budgetStatus) {
                query.budgetStatus = budgetStatus; // Filtra por el estado del presupuesto
            }

            const budgets = await BudgetModel.find(query).populate('clientId', 'clientLastName').exec();
            return budgets;
        } catch (error) {
            console.error("Error en el servicio de presupuestos", error);
            throw new Error("Error al buscar los presupuestos");
        }
    }

    async getBudgetWithDetail(budgetId) {
        console.log("id presupuesto desde service: ", budgetId);

        try {
            if (!mongoose.Types.ObjectId.isValid(budgetId)) {
                return { error: "ID inválido" };
            }

            const budget = await BudgetModel.findById(budgetId);
            if (!budget) {
                return { error: "Presupuesto no encontrado" };
            }

            const budgetDetails = await BudgetDetailModel.find({ budgetID: budgetId }).exec();
            return { budget, budgetDetails };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateBudget(updateBudget, budgetId) {
        try {
            const budget = await BudgetModel.findByIdAndUpdate(budgetId, updateBudget);
            return budget;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteBudget(id) {
        try {
            const deleteBudget = await BudgetModel.findByIdAndDelete(id);
            return deleteBudget;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getBudgetById(budgetId) {
        try {
            const budget = await BudgetModel.findById(budgetId).populate('clientId', 'clientLastName').exec();
            return budget;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}



