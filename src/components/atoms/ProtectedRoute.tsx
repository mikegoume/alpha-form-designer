import { Navigate, Outlet } from "react-router";

import { User } from "../../types/auth";

type ProtectedRouteProps = {
  user: User | null;
};

const ProtectedRoute = ({ user }: ProtectedRouteProps) => {
  console.log("user: ", user, !user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
