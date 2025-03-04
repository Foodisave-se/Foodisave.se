import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import BliMedlem from "./pages/BliMedlem.jsx";
import SökRecept from "./pages/SökRecept.jsx";
import ReceptFörslag from "./pages/ReceptFörslag.jsx";
import ImageRecipe from "./pages/ImageRecipe.jsx";

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
        path: "/sokrecept",
        element: <SökRecept />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/receptforslag",
        element: <ReceptFörslag />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/imagerecipe",
        element: <ImageRecipe />,
        errorElement: <NotFoundPage />,
      },

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
