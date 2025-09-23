import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Root } from "./routes/app/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" />,
  },
  {
    path: "/app",
    element: <Root />,
    children: [
      {
        path: "",
        lazy: async () => {
          const { BlogsRoute } = await import("./routes/app/blogs");
          return { Component: BlogsRoute };
        },
      },
      {
        path: "blogs/:id",
        lazy: async () => {
          const { BlogRoute } = await import("./routes/app/blogs/blog");
          return { Component: BlogRoute };
        },
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
