import Layout from "@/components/layout/Layout";
import { OrganizationList, useOrganization } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnBoarding = () => {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  useEffect(() => {
    if (organization) {
      navigate(`/user/organization/${organization.slug}`);
    }
  }, [organization]);
  return (
    <Layout>
      <div className="flex justify-center items-center pt-14">
        <OrganizationList
          hidePersonal
          afterCreateOrganizationUrl="/user/organization/:slug"
          afterSelectOrganizationUrl="/user/organization/:slug"
        />
      </div>
    </Layout>
  );
};

export default OnBoarding;
