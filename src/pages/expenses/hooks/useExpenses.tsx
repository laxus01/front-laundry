import { useState } from "react";

export interface Expense {
  id: string;
  expense: string;
  value: number;
  date: string;
}

export const useExpenses = () => {
  const defaultExpense: Expense = {
    id: "",
    expense: "",
    value: 0,
    date: new Date().toISOString().split('T')[0],
  };
  
  const [dataExpense, setDataExpense] = useState<Expense>(defaultExpense);

  return {
    defaultExpense,
    dataExpense,
    setDataExpense,
  };
};
