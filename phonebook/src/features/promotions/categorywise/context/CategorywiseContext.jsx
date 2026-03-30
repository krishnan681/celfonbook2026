import { createContext, useContext } from "react";
import { useCategorywiseController } from "../controller/useCategorywiseController";

const CategorywiseContext = createContext();

export const CategorywiseProvider = ({ children }) => {
  const controller = useCategorywiseController();

  return (
    <CategorywiseContext.Provider value={controller}>
      {children}
    </CategorywiseContext.Provider>
  );
};

export const useCategorywise = () => {
  const context = useContext(CategorywiseContext);
  if (!context) {
    throw new Error("useCategorywise must be used inside CategorywiseProvider");
  }
  return context;
};