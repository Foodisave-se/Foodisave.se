import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SearchRecipeWords from "./pages/SearchRecipeWords.jsx";
import ReceptFörslag from "./pages/ReceptFörslag.jsx";
import ImageRecipe from "./pages/ImageRecipe.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardIndexPage from "./pages/DashboardIndexPage.jsx";
import DashboardUserPage from "./pages/DashboardUserPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UserSettingsPage from "./pages/UserSettingsPage.jsx";
import ImageFoodRecipe from "./pages/ImageFoodRecipe.jsx";
import DetailedRecipe from "./pages/DetailedRecipe.jsx";
import RecipeRoulette from "./pages/RecipeRoulette.jsx";
// Nya imports för password reset och aktivering
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ActivateAccountPage from "./pages/ActivateAccountPage.jsx";
import SavedRecipesPage from "./pages/SavedRecipesPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <NotFoundPage /> },
      { path: "/search", element: <SearchRecipeWords />, errorElement: <NotFoundPage /> },
      { path: "/detailedrecipe", element: <DetailedRecipe />, errorElement: <NotFoundPage /> },
      { path: "/random", element: <RecipeRoulette />, errorElement: <NotFoundPage /> },
      { path: "/receptforslag", element: <ReceptFörslag />, errorElement: <NotFoundPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/ImageFoodRecipe", element: <ImageFoodRecipe /> },
      { path: "/imagerecipe", element: <ImageRecipe />, errorElement: <NotFoundPage /> },
      // Nya routes
      { path: "/passwordreset", element: <PasswordResetRequestPage />, errorElement: <NotFoundPage /> },
      { path: "/reset-password", element: <ResetPasswordPage />, errorElement: <NotFoundPage /> },
      { path: "/activate-account", element: <ActivateAccountPage />, errorElement: <NotFoundPage /> },
      { path: "/settings", element: <UserSettingsPage /> },
      { path: "/savedrecipes", element: <SavedRecipesPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <DashboardIndexPage /> },
      { path: "/dashboard/users/:userId", element: <DashboardUserPage /> },
      { path: "/dashboard/settings", element: <UserSettingsPage /> },
      { path: "/dashboard/imagerecipe", element: <ImageRecipe />, errorElement: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
