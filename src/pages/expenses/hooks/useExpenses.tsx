import { useState } from "react";
import dayjs from "dayjs";

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
    date: dayjs().format('YYYY-MM-DD'),
  };
  
  const [dataExpense, setDataExpense] = useState<Expense>(defaultExpense);

  return {
    defaultExpense,
    dataExpense,
    setDataExpense,
  };
};
