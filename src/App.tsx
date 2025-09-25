import { Navigate, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProtectedRoute from "./components/atoms/ProtectedRoute";
import Layout from "./components/organisms/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarProvider";
import FormsRouter from "./pages/forms";
import Login from "./pages/Login";
import ServicesRouter from "./pages/services";
import TemplatesRouter from "./pages/templates";

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute user={user} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/templates" replace />} />
          <Route path="/templates/*" element={<TemplatesRouter />} />
          <Route path="/forms/*" element={<FormsRouter />} />
          <Route path="/services/*" element={<ServicesRouter />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider>
          <AppContent />
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
