import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import portfolioReducer from "./slices/portfolioSlice";
import employeeReducer from "./slices/employeeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    employee: employeeReducer,
  },
});

// Add default export
export default store;
