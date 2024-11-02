import { useOrganization, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import OrgSwitcher from "@/components/user/OrgSwitcher";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

const Project = () => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const dispatch = useDispatch();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({ resolver: zodResolver });
  console.log(membership);

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.warning("Only organization admins can create projects");
      return;
    }

    // createProjectFn(data);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col gap-2 items-center">
          <span className="text-2xl gradient-title">
            Oops! Only Admins can create projects.
          </span>
          <OrgSwitcher />
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
          Create New Project
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <Input
              id="name"
              {...register("name")}
              className="bg-slate-950"
              placeholder="Project Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              id="key"
              {...register("key")}
              className="bg-slate-950"
              placeholder="Project Key (Ex: EZCN)"
            />
            {errors.key && (
              <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
            )}
          </div>
          <div>
            <Textarea
              id="description"
              {...register("description")}
              className="bg-slate-950 h-28 resize-none"
              placeholder="Project Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="bg-blue-500 text-white"
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
          {/* {error && <p className="text-red-500 mt-2">{error.message}</p>} */}
        </form>
      </div>
    </Layout>
  );
};

export default Project;
