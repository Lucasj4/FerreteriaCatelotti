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

    async searchBudgets(clientId, budgetStatus, startDate, endDate) {
        try {
            const query = {};
            

            if (clientId && Array.isArray(clientId) && clientId.length > 0) {
                query.clientId = { $in: clientId }; // Filtra por los IDs de cliente seleccionados
            } else if (clientId) {
                query.clientId = clientId; // Si solo hay un cliente, no es necesario el operador $in
            }


            if (budgetStatus) {
                query.budgetStatus = budgetStatus; // Filtra por el estado del presupuesto
            }

            if (startDate && endDate) {

                const parsedStartDate = new Date(startDate);
                parsedStartDate.setUTCHours(0, 0, 0, 0); // Comienza el día en UTC 00:00:00
            
                const parsedEndDate = new Date(endDate);
                parsedEndDate.setUTCHours(23, 59, 59, 999); 

                query.budgetDate     = {
                    $gte: parsedStartDate,
                    $lte: parsedEndDate,
                }; // Filtrar por rango de fechas
            }

            const budgets = await BudgetModel.find(query).populate('clientId', 'clientLastName').exec();
            return budgets;
        } catch (error) {
            console.error("Error en el servicio de presupuestos", error);
            throw new Error("Error al buscar los presupuestos");
        }
    }

    async getBudgetWithDetail(budgetId) {


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

    async updateBudgetStatusAndBudgetAmount(updateData, budgetId) {
        try {
            const updatedBudget = await BudgetModel.findByIdAndUpdate(
                budgetId,
                {
                    $set: {
                        budgetStatus: updateData.budgetStatus,
                        budgetAmount: updateData.budgetAmount
                    }
                },
                { new: true }
            );

            return updatedBudget;
        } catch (error) {
            req.logger.info(error);
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



