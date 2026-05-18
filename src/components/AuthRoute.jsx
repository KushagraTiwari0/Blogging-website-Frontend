import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthRoute() {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" />;
  return <Outlet />;
}

export default AuthRoute;
