import { SignUp } from "@clerk/clerk-react";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center  my-7 md:my-0 md:h-screen">
      <SignUp></SignUp>
    </div>
  );
};

export default SignUpPage;
