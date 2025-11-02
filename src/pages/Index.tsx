import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl">
            <span className="text-5xl font-bold text-primary-foreground">₱</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent">
              Bienvenido a Pesito
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Tu asistente financiero personal impulsado por IA para gestionar tus facturas y mejorar tus finanzas
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Análisis Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                Obtén insights detallados sobre tus hábitos de gasto
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seguro y Confiable</h3>
              <p className="text-sm text-muted-foreground">
                Tus datos financieros están protegidos y seguros
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">IA Personalizada</h3>
              <p className="text-sm text-muted-foreground">
                Consejos financieros adaptados a tu situación única
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl transition-all duration-300"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
