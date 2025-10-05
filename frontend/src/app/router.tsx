import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Root } from "./routes/app/root";
import { ProtectedRoute } from "./routes/app/protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" />,
  },
  {
    path: "/auth/login",
    lazy: async () => {
      const { LoginRoute } = await import("./routes/auth/login");
      return { Component: LoginRoute };
    },
  },
  {
    path: "/auth/register",
    lazy: async () => {
      const { RegisterRoute } = await import("./routes/auth/register");
      return { Component: RegisterRoute };
    },
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
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
