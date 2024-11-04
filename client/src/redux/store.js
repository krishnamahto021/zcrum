import { configureStore } from "@reduxjs/toolkit";
import { organizationReducer } from "./reducers/organization/organizationReducer";
import { projectReducer } from "./reducers/project/projectReducer";
import { sprintReducer } from "./reducers/project/sprintReducer";

export const store = configureStore({
  reducer: { organizationReducer, projectReducer, sprintReducer },
});
