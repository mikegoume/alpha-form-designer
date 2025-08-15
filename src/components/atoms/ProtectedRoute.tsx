import { Navigate, Outlet } from "react-router";

import { User } from "../../types/auth";

type ProtectedRouteProps = {
  user: User | null;
};

const ProtectedRoute = ({ user }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
