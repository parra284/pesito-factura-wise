import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift, Lock, Check } from "lucide-react";

// Mock data - calcular puntos basados en las facturas
const totalPoints = 141300; // Suma de todas las facturas del historial

const rewards = [
  {
    points: 1000000,
    discount: 20,
    title: "20% de descuento",
    description: "En tecnología y portátiles",
    unlocked: false
  },
  {
    points: 2500000,
    discount: 30,
    title: "30% de descuento",
    description: "En tecnología y portátiles",
    unlocked: false
  },
  {
    points: 5000000,
    discount: 50,
    title: "50% de descuento",
    description: "En tecnología y portátiles",
    unlocked: false
  }
];

const PointsRewards = () => {
  const nextReward = rewards.find(r => !r.unlocked && totalPoints < r.points);
  const progressToNext = nextReward 
    ? (totalPoints / nextReward.points) * 100 
    : 100;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {totalPoints.toLocaleString('es-CO')} puntos
          </CardTitle>
          <p className="text-muted-foreground">
            Acumula puntos con cada factura que subas al sistema
          </p>
        </CardHeader>
        <CardContent>
          {nextReward && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progreso a siguiente recompensa
                </span>
                <span className="font-semibold text-primary">
                  {nextReward.points.toLocaleString('es-CO')} puntos
                </span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <p className="text-xs text-muted-foreground text-right">
                Te faltan {(nextReward.points - totalPoints).toLocaleString('es-CO')} puntos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold text-foreground">Recompensas Disponibles</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {rewards.map((reward) => {
          const isUnlocked = totalPoints >= reward.points;
          
          return (
            <Card 
              key={reward.points}
              className={`transition-all duration-300 ${
                isUnlocked 
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5' 
                  : 'border-border/50 opacity-70'
              }`}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  isUnlocked ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {isUnlocked ? (
                    <Check className="h-8 w-8 text-primary" />
                  ) : (
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {reward.discount}%
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className={isUnlocked ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                      {reward.points.toLocaleString('es-CO')} puntos
                    </span>
                  </div>
                  {isUnlocked && (
                    <p className="text-xs text-primary font-semibold mt-2">
                      ¡Desbloqueado!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PointsRewards;
