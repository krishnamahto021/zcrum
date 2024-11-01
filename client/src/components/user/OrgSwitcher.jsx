import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/clerk-react";
import React from "react";
import { useLocation } from "react-router-dom";

const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const location = useLocation();
  if (!isLoaded || !isUserLoaded) {
    return null;
  }
  // Determine mode based on pathname
  const createOrganizationMode =
    location.pathname === "/onboarding" ? "navigation" : "modal";

  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          createOrganizationMode={createOrganizationMode}
          afterCreateOrganizationUrl="/user/organization/:slug"
          afterSelectOrganizationUrl="/user/organization/:slug"
          createOrganizationUrl="/onboarding"
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "border border-gray-300 rounded-md px-5 py-2",
              organizationSwitcherTriggerIcon: "text-white",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
