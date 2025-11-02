import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import inBioLogo from "@/assets/in-bio-logo.png";
import bgLogin from "@/assets/bg-login.png"; // fondo eco
import { useAuth } from "@/contexts/AuthContext";

type PersonType = "natural" | "juridica";

const Register = () => {
  const [personType, setPersonType] = useState<PersonType>("natural");
  const [documentType, setDocumentType] = useState("");
  const [identification, setIdentification] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [acceptElectronic, setAcceptElectronic] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // bloquear scroll horizontal (opcional)
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = prev; };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones según tipo de persona
    if (personType === "natural") {
      if (!documentType || !identification || !fullName || !email || !phone || !address || !password) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }
    } else {
      // jurídica (usa NIT en identification)
      if (!identification || !fullName || !email || !phone || !address || !password) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }
    }

    if (!acceptElectronic || !acceptTerms) {
      toast.error("Debes aceptar los términos para continuar");
      return;
    }

    setLoading(true);
    try {
      // La firma del backend se mantiene igual; identification llevará el NIT cuando es jurídica
      await register(identification, fullName, address, phone, email, password);
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Efectos de botón embebidos */}
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
        .btn-halo:hover {
          box-shadow: 0 10px 26px -8px rgba(16,185,129,.35), 0 0 0 1px rgba(16,185,129,.20);
        }
      `}</style>

      {/* Oscurecido sutil */}
      <div className="absolute inset-0 -z-10 bg-black/10" />

      <div className="w-full max-w-2xl p-4">
        <Card className="w-full shadow-xl border border-white/50 bg-white/85 backdrop-blur-sm rounded-2xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
              <img src={inBioLogo} alt="In-Bio" className="w-12 h-12 object-contain" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-[#0f2a1f]">
              Registro en In-Bio
            </CardTitle>
            <CardDescription className="text-base text-[#0f2a1f]/80">
              Completa tus datos para crear tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Tipo de persona */}
              <div className="space-y-2">
                <Label htmlFor="personType" className="text-[#0f2a1f]">Tipo de persona</Label>
                <Select
                  value={personType}
                  onValueChange={(val) => setPersonType(val as PersonType)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]">
                    <SelectValue placeholder="Selecciona si eres persona natural o jurídica" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm">
                    <SelectItem value="natural">Persona Natural</SelectItem>
                    <SelectItem value="juridica">Persona Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de documento (solo Natural) */}
              {personType === "natural" && (
                <div className="space-y-2">
                  <Label htmlFor="documentType" className="text-[#0f2a1f]">
                    Tipo de documento de identidad
                  </Label>
                  <Select value={documentType} onValueChange={setDocumentType} disabled={loading}>
                    <SelectTrigger className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]">
                      <SelectValue placeholder="Selecciona tu tipo de documento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                      <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Identificación / NIT (según tipo) */}
              <div className="space-y-2">
                <Label htmlFor="identification" className="text-[#0f2a1f]">
                  {personType === "natural" ? "Número de identificación" : "NIT"}
                </Label>
                <Input
                  id="identification"
                  type="text"
                  placeholder={personType === "natural" ? "Ingresa tu número de identificación" : "NIT (con o sin dígito de verificación)"}
                  value={identification}
                  onChange={(e) => setIdentification(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              {/* Nombre / Razón social */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#0f2a1f]">
                  {personType === "natural" ? "Nombre completo" : "Razón social"}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={personType === "natural" ? "Ingresa tu nombre completo" : "Ingresa la razón social"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              {/* Contacto */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0f2a1f]">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0f2a1f]">Número de teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="300 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#0f2a1f]">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Calle 123 # 45-67"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0f2a1f]">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crea tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/90 border border-[#DDE9E1] text-[#0f2a1f]"
                  disabled={loading}
                />
              </div>

              {/* Aceptaciones */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptElectronic"
                    checked={acceptElectronic}
                    onCheckedChange={(checked) => setAcceptElectronic(checked as boolean)}
                    disabled={loading}
                  />
                  <label htmlFor="acceptElectronic" className="text-sm leading-none text-[#0f2a1f]">
                    Acepto recibir facturas electrónicas en el correo registrado
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={loading}
                  />
                  <label htmlFor="acceptTerms" className="text-sm leading-none text-[#0f2a1f]">
                    Acepto los términos y condiciones del servicio de In-Bio
                  </label>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 rounded-full font-extrabold text-base text-white shadow-md hover:shadow-lg transition-all duration-300 btn-shine btn-glow-emerald btn-halo"
                style={{ backgroundImage: "linear-gradient(45deg, #2f6e4e, #4da370)" }}
                disabled={loading}
              >
                {loading ? "Registrando..." : "Completar Registro"}
              </Button>

              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-[#0f2a1f] hover:text-[#0b2019]"
                  disabled={loading}
                >
                  Ya tengo cuenta, iniciar sesión
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;