import { backendApi } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  issues: [],
  singleIssue: {},
  loading: false,
};
// Create Issue
export const createIssue = createAsyncThunk(
  "organization/issues/create",
  async ({ configWithJWT, issueData }, thunkAPI) => {
    try {
      const { data } = await backendApi.post(
        `/organization/project/issue/create`,
        issueData,
        configWithJWT
      );
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        return { issue: data.issue };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to create issue";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

// Get Issues
export const getIssues = createAsyncThunk(
  "organization/issues/get",
  async ({ configWithJWT }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/organization/issue`,
        configWithJWT
      );
      if (data.success) {
        return { issues: data.issues };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to fetch issues";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

// Update Issue
export const updateIssue = createAsyncThunk(
  "organization/issues/update",
  async ({ configWithJWT, issueId, issueData }, thunkAPI) => {
    try {
      const { data } = await backendApi.put(
        `/organization/issue/${issueId}`,
        issueData,
        configWithJWT
      );
      if (data.success) {
        toast.success(data.message);
        return { issue: data.issue };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to update issue";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

// Delete Issue
export const deleteIssue = createAsyncThunk(
  "organization/issues/delete",
  async ({ configWithJWT, issueId }, thunkAPI) => {
    try {
      const { data } = await backendApi.delete(
        `/organization/issue/${issueId}`,
        configWithJWT
      );
      if (data.success) {
        toast.success("Issue deleted successfully");
        return { issueId };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to delete issue";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

// Get Issue by ID
export const getIssueById = createAsyncThunk(
  "organization/issues/getById",
  async ({ configWithJWT, issueId }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/organization/issue/${issueId}`,
        configWithJWT
      );
      if (data.success) {
        return { issue: data.issue };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to fetch issue";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

const issueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Issue
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues.unshift(action.payload.issue);
      })

      // Get Issues
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.issues = action.payload.issues;
        state.loading = false;
      })
      .addCase(getIssues.rejected, (state) => {
        state.loading = false;
      })

      // Update Issue
      .addCase(updateIssue.fulfilled, (state, action) => {
        const updatedIssue = action.payload.issue;
        const index = state.issues.findIndex(
          (issue) => issue.id === updatedIssue.id
        );
        if (index !== -1) {
          state.issues[index] = updatedIssue;
        }
      })

      // Delete Issue
      .addCase(deleteIssue.fulfilled, (state, action) => {
        const { issueId } = action.payload;
        state.issues = state.issues.filter((issue) => issue.id !== issueId);
      })

      // Get Issue by ID
      .addCase(getIssueById.fulfilled, (state, action) => {
        state.singleIssue = action.payload.issue;
      });
  },
});

export const issueReducer = issueSlice.reducer;
export const issueSelector = (state) => state.issue;
