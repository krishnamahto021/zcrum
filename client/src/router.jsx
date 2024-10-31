import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfilePage from "./pages/user/userProfile";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
]);
