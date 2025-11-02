import { useState } from "react";
import { X, Sparkles, TrendingUp, Bell, Lightbulb, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import pesitoBot from "@/assets/pesito-bot.png";

interface PesitoChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = { text: string; isBot: boolean };

const chatOptions = [
  { id: "consejos", label: "Consejos", icon: Lightbulb, color: "text-yellow-600" },
  { id: "analisis", label: "Análisis de datos", icon: TrendingUp, color: "text-blue-600" },
  { id: "recordatorios", label: "Recordatorios", icon: Bell, color: "text-purple-600" },
  { id: "alertas", label: "Alertas", icon: Sparkles, color: "text-red-600" },
  { id: "metas", label: "Metas y Estudio (IA)", icon: Target, color: "text-green-700" },
];

// --- Utilidades simples para “IA” simulada ---
const toCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

function generateGoalPlan(targetCOP: number, months: number) {
  const monthly = Math.ceil(targetCOP / Math.max(1, months));
  const weekly = Math.ceil(monthly / 4);
  const daily = Math.ceil(weekly / 7);

  return [
    `🎯 **Meta**: Ahorrar ${toCOP(targetCOP)} en ${months} mes(es).`,
    `📆 **Ritmo sugerido**: ${toCOP(monthly)} / mes · ${toCOP(weekly)} / semana · ${toCOP(daily)} / día.`,
    `🧩 **Micro-hábitos**:`,
    `• Redondea compras y guarda el excedente.`,
    `• 24h de “enfriamiento” antes de compras no esenciales.`,
    `• Traslada suscripciones poco usadas a plan anual con descuento.`,
    `• Registra facturas en *Hoy* y clasifícalas (te sube puntos).`,
    `✅ **Checklist semanal**:`,
    `1) Revisar top 3 categorías de gasto.`,
    `2) Ajustar presupuesto del finde (ocio ≤ 20%).`,
    `3) Hacer 1 compra de abarrotes planificada.`,
  ].join("\n");
}

function generateStudyPlan(topic = "Finanzas personales", hoursPerDay = 1) {
  const blocks = Math.max(1, Math.floor((hoursPerDay * 60) / 25)); // Pomodoros de 25 min
  return [
    `📚 **Plan de estudio – ${topic}**`,
    `⏱️ **Rutina diaria**: ${hoursPerDay}h ≈ ${blocks} bloques Pomodoro (25' + 5' pausa).`,
    `🗓️ **Estructura (4 semanas)**:`,
    `• Semana 1: Fundamentos y vocabulario clave.`,
    `• Semana 2: Casos prácticos, ejercicios guiados.`,
    `• Semana 3: Proyecto mini (presupuesto, dashboard, etc.).`,
    `• Semana 4: Simulacros, repasos espaciados y evaluación.`,
    `🧠 **Técnicas**: Active recall, spaced repetition (Anki), Feynman.`,
    `🎯 **Entregables**: 1 resumen semanal + 1 mini-proyecto final.`,
    `💡 **Tip**: Estudia en el mismo horario, app de foco y notificaciones en Modo No Molestar.`,
  ].join("\n");
}

const PesitoChat = ({ isOpen, onClose }: PesitoChatProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy Pesito, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    const option = chatOptions.find(opt => opt.id === optionId);

    if (!option) return;

    setMessages(prev => [...prev, { text: option.label, isBot: false }]);

    // Respuestas simuladas
    setTimeout(() => {
      if (optionId === "consejos") {
        setMessages(prev => [...prev, { text: "¡Claro! Basado en tus facturas de hoy, gastaste $47,100 COP. Te sugiero límite diario de $40,000 para cumplir tu meta de ahorro. 💰", isBot: true }]);
      } else if (optionId === "analisis") {
        setMessages(prev => [...prev, { text: "Analicé tus gastos: 100% en alimentos hoy. Cocinar en casa puede ahorrarte ~30% mensual. 📊", isBot: true }]);
      } else if (optionId === "recordatorios") {
        setMessages(prev => [...prev, { text: "Tienes una meta de $500,000 este mes. Llevas 45% completado. ¡Vas muy bien! 🎯", isBot: true }]);
      } else if (optionId === "alertas") {
        setMessages(prev => [...prev, { text: "⚠️ Gastaste un 20% más que tu promedio semanal. Reduce gastos no esenciales los próximos días.", isBot: true }]);
      } else if (optionId === "metas") {
        // Flujo IA simulado: metas + estudio
        const goal = generateGoalPlan(500000, 1);
        const study = generateStudyPlan("Estadística y Finanzas", 1.5);
        setMessages(prev => [
          ...prev,
          { text: "Estoy generando tu plan de metas y estudio… 🤖", isBot: true }
        ]);
        setTimeout(() => {
          setMessages(prev => [...prev, { text: goal, isBot: true }]);
          setTimeout(() => {
            setMessages(prev => [...prev, { text: study, isBot: true }]);
            setTimeout(() => {
              setMessages(prev => [
                ...prev,
                { text: "¿Quieres que te cree recordatorios automáticos semanales y un checklist diario? Puedo hacerlo. ✅", isBot: true }
              ]);
            }, 800);
          }, 800);
        }, 800);
      }
    }, 800);
  };

  const handleBackToOptions = () => {
    setSelectedOption(null);
    setMessages([
      { text: "¡Hola! Soy Pesito, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?", isBot: true }
    ]);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput("");

    // Respuesta simulada genérica
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "Entiendo tu pregunta. Estoy procesando la información… En una versión completa, usaría tus datos reales para personalizarte el plan. 🤖", isBot: true }
      ]);
    }, 900);
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
                  className={`max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Escribe tu mensaje…"
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