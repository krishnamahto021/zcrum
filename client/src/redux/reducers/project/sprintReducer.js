import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { backendApi } from "@/lib/utils";

const initialState = {
  sprints: {},
  currentSprint: {},
  fetchingSprintsLoading: false,
  creatingSprintLoading: false,
  updatingSprintLoading: false,
  deletingSprintLoading: false,
};

export const createSprint = createAsyncThunk(
  "project/sprints/create",
  async ({ configWithJWT, sprintData }, thunkAPI) => {
    try {
      const { data } = await backendApi.post(
        `/organization/project/sprint/create`,
        sprintData,
        configWithJWT
      );
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        return { sprint: data.sprint };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to create sprint";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const getSprints = createAsyncThunk(
  "project/sprints/get",
  async ({ configWithJWT, projectId }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/organization/project/sprint/get-all/${projectId}`,
        configWithJWT
      );

      if (data.success) {
        return { projectId, sprints: data.sprint };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to fetch sprints";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const updateSprint = createAsyncThunk(
  "project/sprints/update",
  async ({ configWithJWT, sprintId, status, projectId }, thunkAPI) => {
    try {
      const { data } = await backendApi.put(
        `/organization/project/sprint/${sprintId}`,
        { status },
        configWithJWT
      );
      if (data.success) {
        return { sprint: data.sprint, projectId };
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to create sprint";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

// Define similar async thunks for updateSprint and deleteSprint

const sprintSlice = createSlice({
  name: "sprint",
  initialState,
  reducers: {
    setCurrentSprint: (state, action) => {
      state.currentSprint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Sprint
      .addCase(createSprint.pending, (state) => {
        state.creatingSprintLoading = true;
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        const { sprint } = action.payload;
        const projectId = sprint.projectId;
        if (!state.sprints[projectId]) {
          state.sprints[projectId] = [];
        }
        state.sprints[projectId].unshift(sprint);
        state.creatingSprintLoading = false;
      })
      .addCase(createSprint.rejected, (state) => {
        state.creatingSprintLoading = false;
      })
      // Get Sprints
      .addCase(getSprints.pending, (state) => {
        state.fetchingSprintsLoading = true;
      })
      .addCase(getSprints.fulfilled, (state, action) => {
        const { projectId, sprints } = action.payload;
        state.sprints[projectId] = sprints;
        state.fetchingSprintsLoading = false;

        state.currentSprint =
          sprints.find((s) => s.status === "PLANNED") || sprints[0];
      })
      .addCase(getSprints.rejected, (state) => {
        state.fetchingSprintsLoading = false;
      })

      // update sprint
      .addCase(updateSprint.pending, (state) => {
        state.updatingSprintLoading = true;
      })
      .addCase(updateSprint.fulfilled, (state, action) => {
        const { sprint, projectId } = action.payload;
        state.currentSprint = sprint;
        const sprintIndex = state.sprints[projectId].findIndex(
          (s) => s._id === sprint._id
        );

        if (sprintIndex !== -1) {
          state.sprints[projectId][sprintIndex] = sprint;
        }
      });
  },
});

export const { setCurrentSprint } = sprintSlice.actions;
export const sprintReducer = sprintSlice.reducer;
export const sprintSelector = (state) => state.sprintReducer;
