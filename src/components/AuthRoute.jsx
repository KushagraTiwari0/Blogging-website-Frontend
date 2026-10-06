import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthRoute() {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export default AuthRoute;
