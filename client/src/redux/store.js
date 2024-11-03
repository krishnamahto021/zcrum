import { configureStore } from "@reduxjs/toolkit";
import { organizationReducer } from "./reducers/organization/organizationReducer";
import { projectReducer } from "./reducers/project/projectReducer";

export const store = configureStore({
  reducer: { organizationReducer, projectReducer },
});
