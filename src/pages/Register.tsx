import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import inBioLogo from "@/assets/in-bio-logo.png";

const Register = () => {
  const [documentType, setDocumentType] = useState("");
  const [identification, setIdentification] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [acceptElectronic, setAcceptElectronic] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentType || !identification || !fullName || !email || !phone || !address) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!acceptElectronic || !acceptTerms) {
      toast.error("Debes aceptar los términos para continuar");
      return;
    }

    toast.success("¡Registro exitoso! Ahora puedes iniciar sesión");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-2xl shadow-lg border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-24 h-24 flex items-center justify-center">
            <img src={inBioLogo} alt="In-Bio" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Registro en In-Bio
          </CardTitle>
          <CardDescription className="text-base">
            Completa tus datos para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">¿Cuál es tu tipo de documento de identidad?</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona tu tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                  <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification">¿Cuál es tu número de identificación (cédula)?</Label>
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
              <Label htmlFor="fullName">¿Cuál es tu nombre completo?</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">¿Cuál es tu correo electrónico de contacto?</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">¿Cuál es tu número de teléfono o celular?</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">¿Cuál es tu dirección?</Label>
              <Input
                id="address"
                type="text"
                placeholder="Calle 123 # 45-67"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptElectronic"
                  checked={acceptElectronic}
                  onCheckedChange={(checked) => setAcceptElectronic(checked as boolean)}
                />
                <label
                  htmlFor="acceptElectronic"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ¿Aceptas recibir tus facturas electrónicas en el correo registrado?
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos y condiciones del servicio de In-Bio
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all duration-300"
            >
              Completar Registro
            </Button>

            <div className="text-center pt-2">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary-dark"
              >
                Ya tengo cuenta, iniciar sesión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
