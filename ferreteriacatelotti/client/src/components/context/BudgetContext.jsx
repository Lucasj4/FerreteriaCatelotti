import React, { createContext, useState } from "react";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetId, setBudgetId] = useState(null);
  const [detailIds, setDetailIds] = useState([]);

  const addDetailId = (id) => {
    setDetailIds((prev) => [...prev, id]);
  };

  const clearDetailIds = () => {
    setDetailIds([]);
  };

  return (
    <BudgetContext.Provider
      value={{ budgetId, setBudgetId, detailIds, addDetailId, clearDetailIds }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
