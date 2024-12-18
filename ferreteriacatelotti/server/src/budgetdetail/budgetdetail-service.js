import BudgetDetaiLModel from "./budgetdetail-model.js";

export class BudgetDetaiLService {

    async addBudgetDetail(data) {
        try {

            const newDetailOrder = new BudgetDetaiLModel(data);
            return await newDetailOrder.save();



        } catch (error) {
            throw new Error(
                "Error al agregar o actualizar el detalle del presupuesto: " + error.message
            );
        }
    }

    async getBudgetDetailById(id) {
        try {
            const budgetDetailLine = await BudgetDetaiLModel.findById(id);
            return budgetDetailLine;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateBudgetDetail(budgetId, data) {
        try {
            const uptadateBudgetDetail = await BudgetDetaiLModel.findByIdAndUpdate(budgetId, data);
            return uptadateBudgetDetail;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateQuantity(budgetDetailId, quantity) {
        try {
            const updateBudgetDetail = await BudgetDetaiLModel.findByIdAndUpdate(budgetDetailId, { budgetDetailQuantity: quantity }, { new: true })
            return updateBudgetDetail;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteBudgetDetail(id) {
        try {
            const deleteBudgetDetail = await BudgetDetaiLModel.findByIdAndDelete(id);
            return deleteBudgetDetail;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getBudgetDetailsByIds(detailIds) {
        try {
            const budgetDetails = await BudgetDetaiLModel.find({
                _id: { $in: detailIds }, // Filtra por los IDs proporcionados
            });
            return budgetDetails;
        } catch (error) {
            throw new Error("Error al buscar los detalles de presupuesto: " + error.message);
        }
    }

    async getBudgetDetailsByBudgetId(budgetId) {
        try {
            const budgetDetails = await BudgetDetaiLModel.find({ budgetID: budgetId })
            return budgetDetails;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findDetailByPurchaseOrderAndProductName(budgetId, productName) {
        try {
            const budgetDetail = await BudgetDetaiLModel.findOne({
                budgetID: budgetId,
                budgetDetailItem: productName, // Reemplaza con el campo exacto de tu esquema
            });
            return budgetDetail;
        } catch (error) {
            throw new Error("Error al buscar el detalle por PurchaseOrderID y nombre de producto: " + error.message);
        }
    }



}