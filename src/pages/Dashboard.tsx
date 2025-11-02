import { useState } from "react";
import { Button } from "@/components/ui/button";
import InvoiceCarousel from "@/components/InvoiceCarousel";
import InvoiceHistory from "@/components/InvoiceHistory";
import PesitoButton from "@/components/PesitoButton";
import PesitoChat from "@/components/PesitoChat";

const Dashboard = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary-foreground">₱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pesito</h1>
                <p className="text-sm text-muted-foreground">Tu asistente financiero</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!showHistory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Facturas de Hoy</h2>
              <Button
                variant="outline"
                onClick={() => setShowHistory(true)}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
              >
                Ver Historial Completo
              </Button>
            </div>
            <InvoiceCarousel />
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(false)}
              className="text-primary hover:text-primary-dark hover:bg-primary/10"
            >
              ← Volver a Facturas de Hoy
            </Button>
            <InvoiceHistory />
          </div>
        )}
      </main>

      {/* Pesito Bot Button */}
      <PesitoButton onClick={() => setShowChat(true)} />

      {/* Pesito Chat */}
      <PesitoChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default Dashboard;
