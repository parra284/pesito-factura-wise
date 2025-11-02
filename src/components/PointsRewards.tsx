// Visual refresh: carga simulada + contador ascendente + tiers + gradientes + shimmer + tests

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gift, Lock, Check, Sparkles, Crown, Trophy } from "lucide-react";

// --- helpers ---
const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

const calcProgress = (current: number, target: number) => {
  if (target <= 0) return 100;
  const p = (current / target) * 100;
  return Math.min(100, Math.max(0, p));
};

// --- mock state (simulated loading) ---
const BASE_POINTS = 141_300;

const REWARDS = [
  { points: 1_000_000, discount: 20, title: "20% de descuento", description: "En tecnología y portátiles" },
  { points: 2_500_000, discount: 30, title: "30% de descuento", description: "En tecnología y portátiles" },
  { points: 5_000_000, discount: 50, title: "50% de descuento", description: "En tecnología y portátiles" },
] as const;

type Reward = (typeof REWARDS)[number];

function useAnimatedPoints(start = BASE_POINTS) {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const target = useRef(start + Math.round(Math.random() * 12_000)); // simula carga server

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      const duration = 1200;
      const startTs = performance.now();
      const step = (now: number) => {
        const pct = Math.min(1, (now - startTs) / duration);
        const eased = 1 - Math.pow(1 - pct, 3); // easeOutCubic
        setPoints(Math.round(eased * target.current));
        if (pct < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return { loading, points };
}

function TierBadge({ points }: { points: number }) {
  if (points >= 2_500_000)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-xs px-2 py-1">
        <Crown className="h-3 w-3" /> Elite
      </span>
    );
  if (points >= 1_000_000)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600 text-white text-xs px-2 py-1">
        <Trophy className="h-3 w-3" /> Pro
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 text-white text-xs px-2 py-1">
      <Sparkles className="h-3 w-3" /> Starter
    </span>
  );
}

export default function PointsRewards() {
  const { loading, points } = useAnimatedPoints();

  const nextReward: Reward | undefined = useMemo(() => REWARDS.find((r) => points < r.points), [points]);
  const progressToNext = useMemo(() => (nextReward ? calcProgress(points, nextReward.points) : 100), [points, nextReward]);
  const missing = nextReward ? Math.max(0, nextReward.points - points) : 0;

  // smoke tests
  useEffect(() => {
    console.groupCollapsed("[PointsRewards] smoke tests");
    console.assert(calcProgress(50, 100) === 50, "calcProgress 50/100 = 50%");
    console.assert(calcProgress(0, 0) === 100, "calcProgress target 0 -> 100%");
    console.assert(typeof formatCOP(123) === "string", "formatCOP returns string");
    console.groupEnd();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="border-primary/20 bg-gradient-to-br from-emerald-50 to-primary/10 overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
                {loading ? "Cargando…" : `${points.toLocaleString("es-CO")} puntos`}
              </CardTitle>
              <p className="text-muted-foreground">Acumula puntos con cada factura que subas al sistema</p>
              <div className="mt-2">
                <TierBadge points={points} />
              </div>
            </div>
            <div className="hidden sm:block mr-2">
              <div className="h-16 w-16 rounded-full grid place-items-center bg-primary/15 text-primary">
                <Gift className="h-7 w-7" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {nextReward && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso a siguiente recompensa</span>
                <span className="font-semibold text-primary">{nextReward.points.toLocaleString("es-CO")} puntos</span>
              </div>
              <div className="relative">
                <Progress value={progressToNext} className="h-3 overflow-hidden" />
                <div className="pointer-events-none absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {loading ? "Calculando…" : `Te faltan ${missing.toLocaleString("es-CO")} puntos`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold text-foreground">Recompensas Disponibles</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {REWARDS.map((reward) => {
          const isUnlocked = points >= reward.points;
          return (
            <Card
              key={reward.points}
              className={`relative transition-all duration-300 ${
                isUnlocked ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5" : "border-border/50 bg-card/60"
              }`}
            >
              {isUnlocked && <div className="absolute -top-2 right-2 text-xl select-none">🎉</div>}
              <CardContent className="p-6 text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-inner ${
                    isUnlocked ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  {isUnlocked ? <Check className="h-8 w-8 text-primary" /> : <Lock className="h-8 w-8 text-muted-foreground" />}
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-foreground mb-1">{reward.discount}%</h3>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className={isUnlocked ? "text-primary font-semibold" : "text-muted-foreground"}>
                      {reward.points.toLocaleString("es-CO")} puntos
                    </span>
                  </div>
                  {isUnlocked && <p className="text-xs text-primary font-semibold mt-2">¡Desbloqueado!</p>}
                </div>

                <Button variant={isUnlocked ? "default" : "secondary"} disabled={!isUnlocked} className="w-full">
                  {isUnlocked ? "Canjear" : `Aún te faltan ${Math.max(0, reward.points - points).toLocaleString("es-CO")}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
} 