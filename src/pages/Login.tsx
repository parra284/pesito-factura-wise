import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import inBioLogo from "@/assets/in-bio-logo.png";

const Login = () => {
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identification || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Simulación de login - en producción conectar con backend
    if (identification && password) {
      toast.success("¡Bienvenido a Pesito!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-24 h-24 flex items-center justify-center">
            <img src={inBioLogo} alt="In-Bio" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            In-Bio
          </CardTitle>
          <CardDescription className="text-base">
            Tu asistente financiero personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identification">Número de Identificación</Label>
              <Input
                id="identification"
                type="text"
                placeholder="Ingresa tu número de identificación"
                value={identification}
                onChange={(e) => setIdentification(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all duration-300"
            >
              Iniciar Sesión
            </Button>

            <div className="text-center pt-2">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/register")}
                className="text-muted-foreground hover:text-primary"
              >
                No estoy registrado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
