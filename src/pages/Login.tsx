import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
// Importar a API mock para desenvolvimento
import * as mockApi from "@/mocks/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tentar usar a API real primeiro
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      // Se a API real estiver disponível, usar a resposta real
      if (response.ok || response.status === 400 || response.status === 401) {
        const data = await response.json();
        
        if (response.ok) {
          // Salvar token de autenticação no localStorage
          localStorage.setItem("adminToken", "authenticated");
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Login realizado com sucesso!");
          navigate("/admin");
        } else {
          toast.error(data.error || "Credenciais inválidas. Tente novamente.");
        }
        return;
      }
    } catch (error) {
      // Se a API real não estiver disponível, usar a API mock
      console.log("API real não disponível, usando API mock");
    }

    // Usar API mock como fallback
    try {
      const result = await mockApi.loginUser({
        username,
        password
      });
      
      // Salvar token de autenticação no localStorage
      localStorage.setItem("adminToken", "authenticated");
      localStorage.setItem("user", JSON.stringify(result.user));
      toast.success("Login realizado com sucesso (mock)!");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Autenticando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Registre-se
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>4º Congresso de Homens - Homens Inabaláveis</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;