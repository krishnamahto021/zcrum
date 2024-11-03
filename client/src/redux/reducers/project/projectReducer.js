import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { backendApi } from "@/lib/utils";

const initialState = {
  projects: {},
  fetchingProjectsLoading: false,
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
        return { organizationId, projects: data.projects };
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
  async ({ configWithJWT, organizationId, projectId }, thunkAPI) => {
    try {
      const { data } = await backendApi.delete(
        `/organization/project/${projectId}`,
        configWithJWT
      );

      if (data.success) {
        toast.success("Project deleted successfully");
        return { organizationId, projectId };
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
