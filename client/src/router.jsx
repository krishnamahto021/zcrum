import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
]);
