import { useState } from "react";
import { X, Sparkles, TrendingUp, Bell, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import pesitoBot from "@/assets/pesito-bot.png";

interface PesitoChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const chatOptions = [
  { id: "consejos", label: "Consejos", icon: Lightbulb, color: "text-yellow-600" },
  { id: "analisis", label: "Análisis de datos", icon: TrendingUp, color: "text-blue-600" },
  { id: "recordatorios", label: "Recordatorios", icon: Bell, color: "text-purple-600" },
  { id: "alertas", label: "Alertas", icon: Sparkles, color: "text-red-600" }
];

const PesitoChat = ({ isOpen, onClose }: PesitoChatProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "¡Hola! Soy Pesito, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    const option = chatOptions.find(opt => opt.id === optionId);
    
    if (option) {
      setMessages(prev => [
        ...prev,
        { text: option.label, isBot: false }
      ]);

      // Respuestas simuladas de Pesito
      setTimeout(() => {
        let response = "";
        switch (optionId) {
          case "consejos":
            response = "¡Claro! Basado en tus facturas de hoy, gasté $47,100 COP. Te recomiendo establecer un límite diario de $40,000 para cumplir tus metas de ahorro. 💰";
            break;
          case "analisis":
            response = "He analizado tus gastos y veo que el 100% se va en alimentos. Considera preparar comidas en casa para ahorrar hasta 30% mensualmente. 📊";
            break;
          case "recordatorios":
            response = "Tienes una meta de ahorro de $500,000 este mes. Llevas el 45% completado. ¡Vas muy bien! 🎯";
            break;
          case "alertas":
            response = "⚠️ Has gastado un 20% más que el promedio semanal. Te sugiero reducir gastos no esenciales en los próximos días.";
            break;
        }
        setMessages(prev => [...prev, { text: response, isBot: true }]);
      }, 1000);
    }
  };

  const handleBackToOptions = () => {
    setSelectedOption(null);
    setMessages([
      { text: "¡Hola! Soy Pesito, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?", isBot: true }
    ]);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, isBot: false }]);
      setInput("");
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "Entiendo tu pregunta. Estoy procesando la información... En una versión completa, podría darte un análisis detallado basado en tus datos reales. 🤖", isBot: true }
        ]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-card border-border shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
              <img src={pesitoBot} alt="Pesito" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Pesito</h3>
              <p className="text-xs text-muted-foreground">Tu asistente financiero IA</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Options */}
        <div className="p-4 border-b border-border bg-muted/30">
          {selectedOption && (
            <Button
              variant="ghost"
              onClick={handleBackToOptions}
              className="mb-3 text-primary hover:text-primary-dark hover:bg-primary/10"
            >
              ← Volver a opciones
            </Button>
          )}
          {!selectedOption && (
            <>
              <p className="text-sm text-muted-foreground mb-3">Selecciona una opción:</p>
              <div className="grid grid-cols-2 gap-2">
                {chatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      onClick={() => handleOptionClick(option.id)}
                      className="flex items-center gap-2 justify-start h-auto py-3 hover:bg-primary/10 hover:border-primary transition-all"
                    >
                      <Icon className={`h-4 w-4 ${option.color}`} />
                      <span className="text-sm">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 min-h-[300px]">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                    <img src={pesitoBot} alt="Pesito" className="w-6 h-6 object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isBot
                      ? "bg-muted text-foreground"
                      : "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-md"
            >
              Enviar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PesitoChat;
