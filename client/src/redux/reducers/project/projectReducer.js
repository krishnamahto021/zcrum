import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { backendApi } from "@/lib/utils";

const initialState = {
  projects: {},
  fetchingProjectsLoading: false,
  deletingProjectLoading: false,
  singleProject: {},
};

export const createProject = createAsyncThunk(
  "organization/projects/create",
  async ({ configWithJWT, projectData }, thunkAPI) => {
    try {
      const { data } = await backendApi.post(
        `/organization/project/create`,
        projectData,
        configWithJWT
      );
      if (data.success) {
        toast.success(data.message);
        return { project: data.project };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to create project";
      toast.error(errMessage);
      console.log(error);

      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const getProjects = createAsyncThunk(
  "organization/projects/get",
  async ({ configWithJWT }, thunkAPI) => {
    try {
      const { data } = await backendApi.get(
        `/organization/project`,
        configWithJWT
      );
      if (data.success) {
        return { projects: data.projects };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const updateProject = createAsyncThunk(
  "organization/projects/update",
  async (
    { configWithJWT, organizationId, projectId, projectData },
    thunkAPI
  ) => {
    try {
      const { data } = await backendApi.put(
        `/organization/project/${projectId}`,
        projectData,
        configWithJWT
      );

      if (data.success) {
        toast.success(data.message);
        return { organizationId, project: data.project };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to update project";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "organization/projects/delete",
  async ({ configWithJWT, organizationId, projectId, index }, thunkAPI) => {
    try {
      const { data } = await backendApi.delete(
        `/organization/project/${projectId}`,
        configWithJWT
      );

      if (data.success) {
        toast.success("Project deleted successfully");
        return { organizationId, index };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Failed to delete project";
      toast.error(errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        const { organizationId, project } = action.payload;
        if (!state.projects[organizationId]) {
          state.projects[organizationId] = [];
        }
        state.projects[organizationId].push(project);
      })
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.fetchingProjectsLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        const { projects } = action.payload;
        projects.forEach((project) => {
          const orgId = project.organizationId;
          if (!state.projects[orgId]) {
            state.projects[orgId] = [];
          }
          state.projects[orgId] = projects;
        });
        state.fetchingProjectsLoading = false;
      })
      .addCase(getProjects.rejected, (state) => {
        state.fetchingProjectsLoading = false;
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const { organizationId, project } = action.payload;
        const orgProjects = state.projects[organizationId] || [];
        const index = orgProjects.findIndex((p) => p.id === project.id);
        if (index !== -1) {
          orgProjects[index] = project;
        }
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.deletingProjectLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        const { organizationId, index } = action.payload;
        if (state.projects[organizationId]) {
          state.projects[organizationId].splice(index, 1);
        }
        state.deletingProjectLoading = false;
      })
      .addCase(deleteProject.rejected, (state) => {
        state.deletingProjectLoading = false;
      });
  },
});

export const projectReducer = projectSlice.reducer;
export const projectSelector = (state) => state.projectReducer;
