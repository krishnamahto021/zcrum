import { configureStore } from "@reduxjs/toolkit";
import { organizationReducer } from "./reducers/organizationReducer";

export const store = configureStore({
  reducer: { organizationReducer },
});
