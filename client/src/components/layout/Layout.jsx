import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="dotted-background">
      <Header />
      <main className="min-h-screen p-7">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
