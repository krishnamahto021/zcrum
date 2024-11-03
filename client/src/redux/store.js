import { configureStore } from "@reduxjs/toolkit";
import { organizationReducer } from "./reducers/organization/organizationReducer";

export const store = configureStore({
  reducer: { organizationReducer },
});
