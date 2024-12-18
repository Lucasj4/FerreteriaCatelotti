import { BudgetDetaiLService } from "./budgetdetail-service.js";

const budgetDetailService = new BudgetDetaiLService();

export default class BudgetDetaiLController{
    
  async addBudgetDetail(req, res){

    const {budgetID, budgetDetailQuantity, budgetDetailUnitCost, budgetDetailItem, productID} = req.body;

    try {

        const existingDetail = await  budgetDetailService.findDetailByPurchaseOrderAndProductName(budgetID, budgetDetailItem);

        console.log("Existing Detail: ", existingDetail);
        
        if(existingDetail){
          console.log(typeof(existingDetail.budgetDetailQuantity ));
          console.log(typeof(budgetDetailQuantity ));
          
          const quantityUpdate = existingDetail.budgetDetailQuantity + Number(budgetDetailQuantity);
          console.log("quantity: ", quantityUpdate);
          
          const updateBudgetDetail = await budgetDetailService.updateQuantity(existingDetail._id, quantityUpdate);

          console.log("detalle actualizado: ", updateBudgetDetail);
          
          if(updateBudgetDetail){
            return res.status(201).json({message: "Detalle actualizado", updateBudgetDetail})
          }
        }

        const newBudgetDetail = {
            budgetID,
            budgetDetailQuantity,
            budgetDetailUnitCost,
            budgetDetailItem,
            productID
        }

        const budgetDetail = await budgetDetailService.addBudgetDetail(newBudgetDetail);

        return res.status(201).json({message: "Detalle de presupuesto", budgetDetail});
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getBudgetDetailById(req, res){
    
    const {rowid} = req.params;
    try {
      const budgetDetail = await budgetDetailService.getBudgetDetailById(rowid);

      if(budgetDetail){
        return res.status(200).json({message: "Detalle de presupuesto", budgetDetail});
      }else{
        return res.status(404).json({message: "Detalle de presupuesto no encontrado"});
      }
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getBudgetDetailsByIds(req, res) {
    const { detailIds } = req.body; // Se espera un array de IDs en el cuerpo de la solicitud
  
    try {
      if (!Array.isArray(detailIds) || detailIds.length === 0) {
        return res.status(400).json({ message: "Debe proporcionar un array de IDs válido" });
      }
  
      const budgetDetails = await budgetDetailService.getBudgetDetailsByIds(detailIds);
  
      if (budgetDetails.length > 0) {
        return res.status(200).json({ message: "Detalles encontrados", budgetDetails });
      } else {
        return res.status(404).json({ message: "No se encontraron detalles con los IDs proporcionados" });
      }
    } catch (error) {
      req.logger.error("Error al obtener los detalles de presupuesto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateBudgetDetail(req, res){
    const updateBudget = req.body
    const {rowid} = req.params
   
    
    try {
      const existingBudget = await budgetDetailService.getBudgetDetailById(rowid);

      if(!existingBudget){
        return res.status(404).json({success: false, message: "Detalle no encontrado"})
      }

      const budget = await budgetDetailService.updateBudgetDetail(rowid, updateBudget);
      console.log("Budget actualizado: ", budget);
      
      if(budget){
        return res.status(200).json({ message: "Detalle actualizado", budget})
      }
    } catch (error) {
      req.logger.error("Error al actualizar el detalle de presupuesto: ", error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteBudgetDetail(req, res){
    const {rowid} = req.params;

    req.logger.info("id para elimibar budgetDetailLine: " + rowid)
    try {
      const deleteBudgetDetail = await budgetDetailService.deleteBudgetDetail(rowid);

      if (deleteBudgetDetail) {
        res.status(200).json({ message: "Presupuesto eliminado con éxito" });
    } else {
        res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    } catch (error) {
      console.error("Error al eliminar el detalle de presupuesto:", error);
      res.status(500).json({ message: "Error en el servidor al eliminar el presupuesto" });
    }
  }
}