import React, { createContext, useState } from "react";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetId, setBudgetId] = useState(null);
  const [detailIds, setDetailIds] = useState([]);
  const [budgetDate, setBudgetDate] = useState("");
  const [budgetStatus, setBudgetStatus] = useState("Pendiente");
  const [selectedOption, setSelectedOption] = useState([]);

  const addDetailId = (id) => {
    setDetailIds((prev) => [...prev, id]);
  };

  const clearDetailIds = () => {
    setDetailIds([]);
  };

  const clearBudgetId = () => {
    setBudgetId(null)
  }

  return (
    <BudgetContext.Provider
      value={{
        budgetId,
        setBudgetId,
        detailIds,
        addDetailId,
        clearDetailIds,
        budgetDate,
        setBudgetDate,
        budgetStatus,
        setBudgetStatus,
        selectedOption,
        setSelectedOption,
        clearBudgetId
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
