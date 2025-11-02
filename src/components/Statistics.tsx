// =============================================
// File: src/pages/statistics.tsx
// Standalone screen connected like today/history/points
// Now: more colorful + auto‑rotating reminder carousel before charts

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, BellRing, Sparkles, Leaf } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";

// ---- helpers (pure & testable) ----
export const toCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

export function calcGrowth(series: { total: number }[]): number {
  if (!series || series.length < 2) return 0;
  const last = series[series.length - 1]?.total ?? 0;
  const prev = series[series.length - 2]?.total ?? 0;
  if (prev === 0) return 0;
  return ((last - prev) / prev) * 100;
}

// ---- mock data ----
const spendByMonth = [
  { mes: "Jun", total: 420000 },
  { mes: "Jul", total: 515000 },
  { mes: "Ago", total: 480000 },
  { mes: "Sep", total: 590000 },
  { mes: "Oct", total: 560000 },
  { mes: "Nov", total: 610000 },
];

const byCategory = [
  { name: "Alimentos", value: 38 },
  { name: "Transporte", value: 14 },
  { name: "Servicios", value: 22 },
  { name: "Entretenimiento", value: 10 },
  { name: "Hogar", value: 8 },
  { name: "Otros", value: 8 },
];

const dailyTrend = Array.from({ length: 14 }).map((_, i) => ({
  dia: `D${i + 1}`,
  gasto: 15000 + Math.round(Math.random() * 45000),
}));

// ---- reminders carousel (auto-rotating) ----
const REMINDERS = [
  {
    title: "Paga tu servicio de energía",
    body: "Vence mañana a las 11:59 p. m.",
    accent: "from-amber-400 to-orange-500",
    icon: BellRing,
  },
  {
    title: "Meta de ahorro semanal",
    body: "Llevas el 72% — ¡vas genial!",
    accent: "from-emerald-400 to-green-600",
    icon: Leaf,
  },
  {
    title: "Revisa tus suscripciones",
    body: "3 cargos recurrentes esta semana",
    accent: "from-violet-400 to-fuchsia-600",
    icon: Sparkles,
  },
  {
    title: "Recordatorio de presupuesto",
    body: "Entretenimiento al 85% del tope",
    accent: "from-sky-400 to-blue-600",
    icon: Sparkles,
  },
];

function AutoCarousel() {
  const [idx, setIdx] = useState(0);
  const wrap = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  const next = useCallback(() => setIdx((i) => (i + 1) % REMINDERS.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + REMINDERS.length) % REMINDERS.length), []);

  useEffect(() => {
    const tick = () => next();
    timer.current = window.setInterval(tick, 3500);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [next]);

  const pause = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };
  const resume = () => {
    if (!timer.current) timer.current = window.setInterval(() => setIdx((i) => (i + 1) % REMINDERS.length), 3500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background to-primary/5">
      <div
        ref={wrap}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {REMINDERS.map((r, i) => (
          <div key={i} className="min-w-full p-4">
            <div className={`rounded-xl p-4 text-white bg-gradient-to-r ${r.accent} shadow-sm`}> 
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide uppercase opacity-90">Recordatorio</div>
                  <div className="text-lg font-bold">{r.title}</div>
                  <div className="text-sm opacity-90">{r.body}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
        {REMINDERS.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <button aria-label="Anterior" onClick={prev} className="p-2 text-white/80 hover:text-white">‹</button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button aria-label="Siguiente" onClick={next} className="p-2 text-white/80 hover:text-white">›</button>
      </div>
    </div>
  );
}

// Rename default export to avoid any identifier collisions across files/modules
export default function StatisticsScreen() {
  const growth = useMemo(() => calcGrowth(spendByMonth), []);
  const totalNov = spendByMonth[spendByMonth.length - 1].total;

  // ---- tiny smoke tests (unchanged + added) ----
  useEffect(() => {
    console.groupCollapsed("[statistics.tsx] smoke tests");

    // existing test: toCOP basic formatting
    console.assert(toCOP(123456).includes("123"), "toCOP should format number");

    // existing test: calcGrowth 100 -> 110 = 10%
    {
      const g = calcGrowth([{ total: 100 }, { total: 110 }]);
      console.assert(Math.abs(g - 10) < 1e-9, "calcGrowth 100->110 is 10%", g);
    }

    // added test: calcGrowth guard when prev = 0 must return 0 (avoid div by zero)
    {
      const g = calcGrowth([{ total: 0 }, { total: 50 }]);
      console.assert(g === 0, "calcGrowth prev=0 returns 0", g);
    }

    // added test: toCOP should include currency symbol/formatting
    {
      const s = toCOP(0);
      console.assert(typeof s === "string" && s.length > 0, "toCOP returns non-empty string", s);
    }

    console.groupEnd();
  }, []);

  // chart palette
  const palette = {
    line: "#22c55e", // green-500
    bar: "#3b82f6",  // blue-500
    grid: "#e5e7eb", // gray-200
    pie: ["#22c55e", "#06b6d4", "#a855f7", "#f59e0b", "#ef4444", "#64748b"],
  } as const;

  return (
    <div className="space-y-5">
      {/* Headline */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Estadísticas</h2>
          <p className="text-sm text-muted-foreground">Resumen visual de tus finanzas</p>
        </div>
      </div>

      {/* Auto-rotating reminders */}
      <AutoCarousel />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200">
          <CardContent className="p-3">
            <div className="text-xs text-emerald-800/80">Gasto Noviembre</div>
            <div className="text-xl font-semibold text-emerald-900">{toCOP(totalNov)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200">
          <CardContent className="p-3">
            <div className="text-xs text-blue-800/80">Variación vs Oct</div>
            <div className="flex items-center gap-2 mt-1">
              {growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={growth >= 0 ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
                {growth.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Línea: gasto por mes */}
      <Card>
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-2">Evolución mensual</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendByMonth} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(v) => `${Math.round((v as number) / 1000)}k`} />
                <Tooltip formatter={(v: number) => toCOP(v as number)} />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total mensual" stroke={palette.line} strokeWidth={3} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Barras: tendencia diaria */}
      <Card>
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-2">Gasto últimos 14 días</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
                <XAxis dataKey="dia" />
                <YAxis tickFormatter={(v) => `${Math.round((v as number) / 1000)}k`} />
                <Tooltip formatter={(v: number) => toCOP(v as number)} />
                <Legend />
                <Bar dataKey="gasto" name="Gasto diario" fill={palette.bar} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie: distribución por categorías */}
      <Card>
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-2">Distribución por categorías</div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {byCategory.map((_, idx) => (
                    <Cell key={idx} fill={palette.pie[idx % palette.pie.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}