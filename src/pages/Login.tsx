// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import inBioLogo from "@/assets/in-bio-logo.png";
import bgLogin from "@/assets/bg-login.png"; // mismo fondo del Index
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Bloquear scroll (pantalla fija)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identification || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    // ── Acceso de demo ──────────────────────────────────────────────
    if (identification === "12345678" && password === "12345678") {
      toast.success("¡Bienvenido a In-Bio! (modo demo)");
      navigate("/dashboard");
      setLoading(false);
      return;
    }
    // ────────────────────────────────────────────────────────────────

    try {
      await login(identification, password);
      toast.success("¡Bienvenido a In-Bio!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overscrollBehavior: "none",
      }}
    >
      {/* Efectos de botones embebidos */}
      <style>{`
        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(16,185,129,0), 0 0 0 rgba(16,185,129,0); filter: brightness(1); }
          50% { box-shadow: 0 0 18px rgba(16,185,129,0.35), 0 0 42px rgba(16,185,129,0.20); filter: brightness(1.04); }
        }
        .btn-glow-emerald { animation: btn-glow 2.4s ease-in-out infinite; }
        .btn-shine { position: relative; overflow: hidden; isolation: isolate; }
        .btn-shine::before {
          content: ""; position: absolute; inset: -120% auto auto -30%;
          width: 40%; height: 300%; transform: rotate(25deg) translateX(-100%);
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%);
          transition: transform .75s ease; opacity: .65; pointer-events: none; z-index: 1;
        }
        .btn-shine:hover::before { transform: rotate(25deg) translateX(260%); }
        .btn-halo:hover { box-shadow: 0 10px 26px -8px rgba(16,185,129,.35), 0 0 0 1px rgba(16,185,129,.20); }
      `}</style>

      {/* Capa de oscurecido sutil para contraste */}
      <div className="absolute inset-0 -z-10 bg-black/10" />

      {/* Contenido centrado */}
      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Encabezado: logo + texto (MISMA estructura, más arriba) */}
        <div className="flex items-center justify-center gap-3 mb-5 -mt-6 md:-mt-8">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center">
            <img src={inBioLogo} alt="In-Bio" className="w-12 h-12 object-contain" />
          </div>
          <div className="leading-tight text-center">
            <p className="text-white/90 font-extrabold text-[30px] tracking-wide">WELCOME!</p>
            <p className="text-white font-extrabold text-[40px] leading-[1]">
              IN-<span className="text-green-200">BIO</span>
            </p>
          </div>
        </div>

        {/* Tarjeta más pequeña y transparente */}
        <Card className="bg-white/85 border border-white/60 shadow-xl rounded-2xl p-5 backdrop-blur-sm mt-10">
          <CardHeader className="text-center p-0 mb-2">
            <CardDescription className="text-[#0f2a1f]/80">Tu asistente financiero personal</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="identification" className="text-[#0f2a1f]">Número de Identificación</Label>
                <Input
                  id="identification"
                  type="text"
                  placeholder="Cédula"
                  value={identification}
                  onChange={(e) => setIdentification(e.target.value)}
                  disabled={loading}
                  className="h-10 bg-white/80 backdrop-blur-[2px] border border-[#DDE9E1] text-[#0f2a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#0f2a1f]">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10 bg-white/80 backdrop-blur-[2px] border border-[#DDE9E1] text-[#0f2a1f]"
                />
              </div>

              {/* Ingresar con TEXTO BLANCO */}
              <Button
                type="submit"
                className="w-full h-11 rounded-full font-extrabold text-base shadow-md hover:shadow-lg transition-all duration-300 btn-shine btn-glow-emerald btn-halo text-white"
                style={{ backgroundImage: "linear-gradient(45deg, #2f6e4e, #4da370)" }}
                disabled={loading}
              >
                {loading ? "Iniciando..." : "Ingresar"}
              </Button>

              <div className="text-center pt-1">
                {/* Link oscuro */}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/register")}
                  className="text-[#0f2a1f] hover:text-[#0b2019]"
                  disabled={loading}
                >
                  ¿No tienes cuenta? Regístrate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;