import React from "react";
import { Outlet } from "react-router-dom";
import { AuthGuard } from "../components/Guards";
import Home from "../pages/home";

const ProtectedRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: (
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ],
};

export default ProtectedRoutes;
