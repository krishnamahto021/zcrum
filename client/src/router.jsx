import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfilePage from "./pages/user/userProfile";
import OnBoarding from "./pages/user/OnBoarding";
import OrganizationPage from "./pages/user/OrganizationPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/onboarding", element: <OnBoarding /> },

  {
    path: "/user/dashboard",
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/organization/:organizationSlug",
    element: (
      <ProtectedRoute>
        <OrganizationPage />
      </ProtectedRoute>
    ),
  },
]);
