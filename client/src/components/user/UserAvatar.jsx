import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserAvatar = ({ user }) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.profileImage} alt={user?.firstName} />
        <AvatarFallback className="capitalize">
          {user ? user.firstName : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user ? user.firstName : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
