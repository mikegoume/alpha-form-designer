import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProtectedRoute from "./components/atoms/ProtectedRoute";
import Layout from "./components/organisms/Layout";
import AuthContext from "./contexts/auth/authContext";
import { SnackbarProvider } from "./contexts/SnackbarProvider";
import FormsRouter from "./pages/forms";
import Login from "./pages/Login";
import ServicesRouter from "./pages/services";
import TemplatesRouter from "./pages/templates";
import { User } from "./types/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, setUser }}>
        <SnackbarProvider>
          <Routes>
            <Route element={<ProtectedRoute user={user} />}>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/templates" replace />}
                />
                <Route path="/templates/*" element={<TemplatesRouter />} />
                <Route path="/forms/*" element={<FormsRouter />} />
                <Route path="/services/*" element={<ServicesRouter />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </SnackbarProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
