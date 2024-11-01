import Layout from "@/components/layout/Layout";
import OrgSwitcher from "@/components/user/OrgSwitcher";
import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { Navigate } from "react-router-dom";

const OrganizationPage = () => {
  const { userId } = useAuth();
  if (!userId) {
    return <Navigate to={"/sign-in"}></Navigate>;
  }
  const organization = {
    name: "vtu",
  };
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-5xl font-bold gradient-title pb-2">
            {organization.name}&rsquo;s Projects
          </h1>

          <OrgSwitcher />
        </div>
        <div className="mb-4">
          {/* <ProjectList orgId={organization.id} /> */}
        </div>
        <div className="mt-8">{/* <UserIssues userId={userId} /> */}</div>
      </div>
    </Layout>
  );
};

export default OrganizationPage;
