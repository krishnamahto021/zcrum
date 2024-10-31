import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./components/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="zcrum-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
