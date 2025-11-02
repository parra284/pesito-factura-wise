// =============================================
// File: src/pages/Dashboard.tsx
// - Arregla navegación: tabs arriba (desktop) + tab bar abajo (mobile)
// - Botón de Pesito arrastrable (mouse/touch), con snap a bordes y posición persistente
// - Import corrigido de StatisticsScreen
// - + Botón Cerrar sesión en esquina superior derecha

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← NUEVO
import { Button } from "@/components/ui/button";
import InvoiceCarousel from "@/components/InvoiceCarousel";
import InvoiceHistory from "@/components/InvoiceHistory";
import PointsRewards from "@/components/PointsRewards";
import PesitoButton from "@/components/PesitoButton";
import PesitoChat from "@/components/PesitoChat";
import inBioLogo from "@/assets/in-bio-logo.png";
import StatisticsScreen from "@/components/Statistics"; // Asegúrate de que este path exista
import { Receipt, History as HistoryIcon, Gift, BarChart3, LogOut } from "lucide-react"; // ← LogOut
import { useAuth } from "@/contexts/AuthContext"; // ← NUEVO

type TabKey = "today" | "history" | "points" | "statistics";

const TAB_META: { key: TabKey; label: string; icon: React.ComponentType<any> }[] = [
  { key: "today", label: "Hoy", icon: Receipt },
  { key: "history", label: "Historial", icon: HistoryIcon },
  { key: "points", label: "Puntos", icon: Gift },
  { key: "statistics", label: "Estadísticas", icon: BarChart3 },
];

const LS_TAB_KEY = "inbio_active_tab";
const LS_PESITO_POS = "inbio_pesito_pos";
const PESITO_SIZE = 56; // h-14 w-14
const MARGIN = 12;

export default function Dashboard() {
  const navigate = useNavigate();            // ← NUEVO
  const { logout } = useAuth();              // ← NUEVO

  // ------------ NAV: estado inicial desde hash/localStorage ------------
  const initialTab: TabKey = useMemo(() => {
    const hash = (window.location.hash || "").replace("#", "") as TabKey;
    if (hash && TAB_META.find((t) => t.key === hash)) return hash;
    const saved = (localStorage.getItem(LS_TAB_KEY) || "") as TabKey;
    if (saved && TAB_META.find((t) => t.key === saved)) return saved;
    return "today";
  }, []);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [showChat, setShowChat] = useState(false);

  // Sincroniza hash y storage
  useEffect(() => {
    if (activeTab) {
      if (window.location.hash !== `#${activeTab}`) history.replaceState(null, "", `#${activeTab}`);
      localStorage.setItem(LS_TAB_KEY, activeTab);
    }
  }, [activeTab]);

  // Reacciona a cambios de hash (deep links)
  useEffect(() => {
    const onHash = () => {
      const hash = (window.location.hash || "").replace("#", "") as TabKey;
      if (hash && TAB_META.find((t) => t.key === hash)) setActiveTab(hash);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const map: Record<string, TabKey> = { "1": "today", "2": "history", "3": "points", "4": "statistics" };
      const hit = map[e.key];
      if (hit) {
        e.preventDefault();
        setActiveTab(hit);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ------------ PESITO: Botón arrastrable ------------
  type Pos = { x: number; y: number };
  const [pos, setPos] = useState<Pos>(() => {
    try {
      const raw = localStorage.getItem(LS_PESITO_POS);
      if (raw) return JSON.parse(raw) as Pos;
    } catch {}
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      x: Math.max(MARGIN, vw - PESITO_SIZE - MARGIN),
      y: Math.max(MARGIN, vh - PESITO_SIZE - (80 /* tabbar aprox */) - MARGIN),
    };
  });

  const draggingRef = useRef(false);
  const startRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const runnerRef = useRef<HTMLDivElement>(null);

  // Guarda posición
  useEffect(() => {
    try {
      localStorage.setItem(LS_PESITO_POS, JSON.stringify(pos));
    } catch {}
  }, [pos]);

  // Limita a viewport
  const clampToViewport = (x: number, y: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = vw - PESITO_SIZE - MARGIN;
    const maxY = vh - PESITO_SIZE - MARGIN;
    return { x: Math.min(Math.max(MARGIN, x), maxX), y: Math.min(Math.max(MARGIN, y), maxY) };
  };

  // Drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
    startRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    target.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !startRef.current) return;
    const dx = e.clientX - startRef.current.startX;
    const dy = e.clientY - startRef.current.startY;
    const next = clampToViewport(startRef.current.origX + dx, startRef.current.origY + dy);
    setPos(next);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    startRef.current = null;
    const node = runnerRef.current;
    if (node) node.style.cursor = "grab";
    const vw = window.innerWidth;
    const snap = 40;
    const snapLeft = pos.x <= MARGIN + snap;
    const snapRight = vw - (pos.x + PESITO_SIZE) <= MARGIN + snap;
    if (snapLeft) setPos((p) => ({ ...p, x: MARGIN }));
    else if (snapRight) setPos((p) => ({ ...p, x: vw - PESITO_SIZE - MARGIN }));
  };

  // Re-clamp en resize
  useEffect(() => {
    const onResize = () => setPos((p) => clampToViewport(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ------------ LOGOUT (handler) ------------
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error(e);
      // opcional: toast.error("No se pudo cerrar sesión");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 from-background via-primary/5 to-background pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-20 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Izquierda: logo + texto */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img src={inBioLogo} alt="In-Bio" className="w-full h-full object-contain" />
              </div>
              <div className="truncate">
                <h1 className="text-2xl font-bold text-foreground leading-tight">In-Bio</h1>
                <p className="text-sm text-muted-foreground truncate">Tu asistente financiero</p>
              </div>
            </div>

            {/* Derecha: Cerrar sesión (NUEVO) */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="rounded-xl h-9 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Tabs superiores (desktop/tablet) */}
        <nav className="hidden md:flex gap-2 mb-6 border-b border-border/50">
          {TAB_META.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              onClick={() => setActiveTab(key)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`rounded-b-none border-b-2 transition-colors ${
                activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </nav>

        {/* Contenido */}
        <section aria-live="polite">
          {activeTab === "today" && <InvoiceCarousel />}
          {activeTab === "history" && <InvoiceHistory />}
          {activeTab === "points" && <PointsRewards />}
          {activeTab === "statistics" && <StatisticsScreen />}
        </section>
      </main>

      {/* Tab bar inferior (mobile) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70"
        role="tablist"
        aria-label="Navegación principal"
      >
        <div className="mx-auto max-w-screen-sm px-2 py-2 grid grid-cols-4 gap-1">
          {TAB_META.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                aria-current={active ? "page" : undefined}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center justify-center rounded-xl py-2 text-xs transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${active ? "text-primary" : ""}`} />
                <span className="leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Botón Pesito arrastrable */}
      <div
        ref={runnerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="fixed z-40 cursor-grab touch-none select-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: PESITO_SIZE,
          height: PESITO_SIZE,
          left: 0,
          top: 0,
        }}
      >
        <PesitoButton onClick={() => setShowChat(true)} />
      </div>

      {/* Chat */}
      <PesitoChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}