import { createBrowserRouter } from "react-router-dom";
import Layout from "./shared/Layout";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <BuilderPage /> }, // "/"
      { path: "preview", element: <PreviewPage /> }, // "/preview"
      { path: "*", element: <NotFound /> },
    ],
  },
]);
