import { useOrganization, useUser } from "@clerk/clerk-react";
import React from "react";

const UserLoading = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  if (!isLoaded || !isUserLoaded) {
    return (
      <div className="flex items-center gap-1">
        <div className="loader border-4 border-t-transparent border-white rounded-full w-5 h-5 animate-spin"></div>
      </div>
    );
  } else return <></>;
};

export default UserLoading;
