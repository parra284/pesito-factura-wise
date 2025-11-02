import { useState } from "react";
import { Button } from "@/components/ui/button";
import InvoiceCarousel from "@/components/InvoiceCarousel";
import InvoiceHistory from "@/components/InvoiceHistory";
import PointsRewards from "@/components/PointsRewards";
import PesitoButton from "@/components/PesitoButton";
import PesitoChat from "@/components/PesitoChat";
import inBioLogo from "@/assets/in-bio-logo.png";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"today" | "history" | "points">("today");
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={inBioLogo} alt="In-Bio" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">In-Bio</h1>
                <p className="text-sm text-muted-foreground">Tu asistente financiero</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border/50">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("today")}
            className={`rounded-b-none border-b-2 transition-colors ${
              activeTab === "today" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Facturas de Hoy
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("history")}
            className={`rounded-b-none border-b-2 transition-colors ${
              activeTab === "history" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Historial
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("points")}
            className={`rounded-b-none border-b-2 transition-colors ${
              activeTab === "points" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Tus Puntos
          </Button>
        </div>

        {/* Content */}
        {activeTab === "today" && <InvoiceCarousel />}
        {activeTab === "history" && <InvoiceHistory />}
        {activeTab === "points" && <PointsRewards />}
      </main>

      {/* Pesito Bot Button */}
      <PesitoButton onClick={() => setShowChat(true)} />

      {/* Pesito Chat */}
      <PesitoChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default Dashboard;
