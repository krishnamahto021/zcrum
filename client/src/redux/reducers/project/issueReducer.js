import { backendApi } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  issuesByStatus: {
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  },
  singleIssue: {},
  loading: false,
};

// helper function to organize issue

const organizeIssuesByStatus = (issues) => {
  const organized = {
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  };

  issues.forEach((issue) => {
    if (organized[issue.status]) {
      organized[issue.status].push(issue);
    }
  });

  // Sort each status array by order
  Object.keys(organized).forEach((status) => {
    organized[status].sort((a, b) => a.order - b.order);
  });

  return organized;
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
  async ({ configWithJWT, sprintId }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/organization/project/issue/sprint/${sprintId}`,
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
        `/organization/project/issue/${issueId}`,
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
        `/organization/project/issue/${issueId}`,
        configWithJWT
      );
      console.log(data);

      if (data.success) {
        toast.success("Issue deleted successfully");
        return { issue: data.issue };
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
        const newIssue = action.payload.issue;
        state.issuesByStatus[newIssue.status].unshift(newIssue);
      })

      // Get Issues
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.issuesByStatus = organizeIssuesByStatus(action.payload.issues);
        state.loading = false;
      })
      .addCase(getIssues.rejected, (state) => {
        state.loading = false;
      })

      // Update Issue
      .addCase(updateIssue.fulfilled, (state, action) => {
        const updatedIssue = action.payload.issue;

        // First, find and remove the issue from its current status array
        Object.keys(state.issuesByStatus).forEach((status) => {
          state.issuesByStatus[status] = state.issuesByStatus[status].filter(
            (issue) => issue._id !== updatedIssue._id
          );
        });

        // Then add the updated issue to its new status array
        state.issuesByStatus[updatedIssue.status].push(updatedIssue);

        // Sort the array by order if needed
        state.issuesByStatus[updatedIssue.status].sort(
          (a, b) => a.order - b.order
        );
      })

      // Delete Issue
      .addCase(deleteIssue.fulfilled, (state, action) => {
        const { issue } = action.payload;
        state.issuesByStatus[issue.status] = state.issuesByStatus[
          issue.status
        ].filter((i) => i._id !== issue._id);
      })

      // Get Issue by ID
      .addCase(getIssueById.fulfilled, (state, action) => {
        state.singleIssue = action.payload.issue;
      });
  },
});

export const issueReducer = issueSlice.reducer;
export const issueSelector = (state) => state.issueReducer;
0;
