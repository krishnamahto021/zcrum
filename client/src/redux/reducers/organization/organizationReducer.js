import { backendApi } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  organizations: [],
  fetchingOrganizationLoading: false,
  singleOrganization: {},
};
export const getOrganization = createAsyncThunk(
  "user/orgainzation/get",
  async ({ configWithJWT, organizationSlug }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/user/organization/${organizationSlug}`,
        configWithJWT
      );

      if (data.success) {
        return data.organization;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage = error.response.data.message || "Something went wrong";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

const orgainzationSlice = createSlice({
  name: "organization",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getOrganization.pending, (state) => {
        state.fetchingOrganizationLoading = true;
      })
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.singleOrganization = action.payload;
        state.fetchingOrganizationLoading = false;
      })
      .addCase(getOrganization.rejected, (state) => {
        state.fetchingOrganizationLoading = false;
      });
  },
});

export const organizationReducer = orgainzationSlice.reducer;
export const organizationSelector = (state) => state.organizationReducer;
