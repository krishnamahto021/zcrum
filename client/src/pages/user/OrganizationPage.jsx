import Layout from "@/components/layout/Layout";
import Loader from "@/components/Loader";
import ProjectList from "@/components/projects/ProjectList";
import OrgSwitcher from "@/components/user/OrgSwitcher";
import { useConfig } from "@/lib/utils";
import {
  getOrganization,
  organizationSelector,
} from "@/redux/reducers/organization/organizationReducer";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

const OrganizationPage = () => {
  const { userId } = useAuth();
  const { organizationSlug } = useParams();
  const { singleOrganization, fetchingOrganizationLoading } =
    useSelector(organizationSelector);

  if (!userId) {
    return <Navigate to={"/sign-in"}></Navigate>;
  }
  const dispatch = useDispatch();
  const { configWithJWT } = useConfig();
  useEffect(() => {
    if (configWithJWT.headers.Authorization && organizationSlug) {
      dispatch(getOrganization({ organizationSlug, configWithJWT }));
    }
  }, [organizationSlug, configWithJWT]);
  return (
    <Layout>
      {fetchingOrganizationLoading && <Loader />}
      <div className="container mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-5xl font-bold gradient-title pb-2">
            {singleOrganization?.name}&rsquo;s Projects
          </h1>

          <OrgSwitcher />
        </div>
        <div className="mb-4">
          <ProjectList />
        </div>
        <div className="mt-8">{/* <UserIssues userId={userId} /> */}</div>
      </div>
    </Layout>
  );
};

export default OrganizationPage;
