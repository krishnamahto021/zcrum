import { UserProfile } from "@clerk/clerk-react";
import React from "react";

const UserProfilePage = () => {
  return (
    <div className="flex p-7  justify-center items-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
