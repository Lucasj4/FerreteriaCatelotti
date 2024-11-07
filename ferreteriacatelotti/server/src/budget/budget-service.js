import BudgetModel from "./budget-model.js";

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
            const budgets = await BudgetModel.find().populate('clientID', 'clientLastName');
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

            if (clientId) {
                query.clientID = { $in: clientId }; // Filtra por los IDs de cliente seleccionados
            }

            if (budgetStatus) {
                query.budgetStatus = budgetStatus; // Filtra por el estado del presupuesto
            }

            const budgets = await BudgetModel.find(query).exec();
            return budgets;
        } catch (error) {
            console.error("Error en el servicio de presupuestos", error);
            throw new Error("Error al buscar los presupuestos");
        }
    }



}