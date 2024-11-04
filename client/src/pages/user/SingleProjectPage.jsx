import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { addDays, format, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectById,
  projectSelector,
} from "@/redux/reducers/project/projectReducer";
import { DayPicker } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import "react-day-picker/dist/style.css";
import Layout from "@/components/layout/Layout";
import Loader from "@/components/Loader";
import { createSprint } from "@/redux/reducers/project/sprintReducer";

const SingleProjectPage = () => {
  const { projectId } = useParams();
  const { configWithJWT } = useConfig();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const today = startOfToday();
  const [dateRange, setDateRange] = useState({
    from: today,
    to: addDays(today, 14),
  });

  const { singleProject, fetchingProjectsLoading } =
    useSelector(projectSelector);

  useEffect(() => {
    if (configWithJWT.headers.Authorization) {
      dispatch(getProjectById({ configWithJWT, projectId }));
    }
  }, [configWithJWT]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      dateRange: {
        from: today,
        to: addDays(today, 14),
      },
    },
  });

  // Update form values once singleProject is loaded
  useEffect(() => {
    if (singleProject) {
      const projectKey = singleProject.key;
      const sprintKey = singleProject.sprints?.length + 1 || 1;
      setValue("name", `${projectKey}-${sprintKey}`);
    }
  }, [singleProject, setValue]);

  const onSubmit = async (data) => {
    const dataToBeSent = { ...data, projectId };
    dispatch(createSprint({ sprintData: dataToBeSent, configWithJWT }));
    setShowForm(false);
  };

  return (
    <Layout>
      {fetchingProjectsLoading && <Loader />}
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          {singleProject?.name}
        </h1>
        <Button
          className="mt-2 transition-all duration-300 hover:scale-105"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4 border border-slate-800 shadow-lg">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-slate-300"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  className="bg-slate-900 border-slate-700 focus:outline-none focus:border-none cursor-not-allowed"
                  readOnly
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-slate-300">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800 transition-colors ${
                            !dateRange && "text-slate-500"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-slate-900 border border-slate-700 shadow-xl"
                        align="start"
                      >
                        <DayPicker
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from) {
                              setDateRange(range);
                              field.onChange(range);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Create Sprint
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {singleProject && singleProject.sprints?.length > 0 && (
        <p>{singleProject.sprints[0].name}</p>
      )}
    </Layout>
  );
};

export default SingleProjectPage;
