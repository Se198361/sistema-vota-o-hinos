import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Voting from "./pages/Voting";
import Admin from "./pages/Admin";
<<<<<<< HEAD
import Auth from "./pages/Auth";
=======
import Login from "./pages/Login";
import Register from "./pages/Register";
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

<<<<<<< HEAD
=======
// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem("adminToken") === "authenticated";
};

// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Login />;
};

>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Voting />} />
<<<<<<< HEAD
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
=======
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> c4f3775acd899678286e6cbaace46920e1a0a4d8
