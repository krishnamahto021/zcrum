import Layout from "@/components/layout/Layout";
import { useAuth, UserProfile } from "@clerk/clerk-react";
import React from "react";

const UserProfilePage = () => {
  const { getToken } = useAuth();
  async function getjwt() {
    const jwtToken = await getToken();
    console.log(jwtToken);
  }
  getjwt();
  return (
    <Layout>
      <div className="flex p-7  justify-center items-center">
        <UserProfile />
      </div>
    </Layout>
  );
};

export default UserProfilePage;
