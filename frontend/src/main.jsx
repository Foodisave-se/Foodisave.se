import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import BliMedlem from "./pages/BliMedlem.jsx";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/blimedlem",
        element: <BliMedlem />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/search",
        element: <SearchRecipeWords />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/recipe/:id",
        element: <DetailedRecipe />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/random",
        element: <RecipeRoulette />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/receptforslag",
        element: <ReceptFörslag />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/ImageFoodRecipe",
        element: <ImageFoodRecipe />,
      },

    ],
  },
  {
    // Dashboard layout
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
    {
      path: "", // /dashboard
      element: <DashboardIndexPage />,
    },
    {
      path: "/dashboard/users/:userId",
      element: <DashboardUserPage />,
    },
    {
      path: "/dashboard/settings", // /dashboard
      element: <UserSettingsPage />,
    },
    {
      path: "/dashboard/imagerecipe",
      element: <ImageRecipe />,
      errorElement: <NotFoundPage />,
    },
  ],
},
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
