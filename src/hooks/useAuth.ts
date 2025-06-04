import { useContext } from "react";

import AuthContext from "../contexts/auth/authContext"; // adjust path as needed

export function useAuth() {
  const { user, setUser } = useContext(AuthContext);

  if (!user) {
    throw new Error("useAuth must be used with a logged-in user.");
  }

  return { user, setUser };
}
