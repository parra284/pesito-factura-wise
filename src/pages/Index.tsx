// src/pages/Index.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Sparkles } from "lucide-react";
import inBioLogo from "@/assets/in-bio-logo.png";
import bgLogin from "@/assets/bg-login.png";            // ← tu fondo alargado
import plantAnim from "@/assets/plant.json";            // ← lottie plantita

/** Paleta */
const P = {
  pine: "#183a2b",
  moss: "#2f6e4e",
  meadow: "#4da370",
  cloud: "#e8f2ea",
};

const phrases = [
  "Clasifica tus facturas en segundos con Pesito 🤖",
  "Gana puntos verdes por tus compras sostenibles 🌿",
  "Proyecciones y análisis para gastar mejor 📈",
  "Metas y plan de estudio personalizado con IA 🎯",
];

export default function Index() {
  const navigate = useNavigate();

  /** Bloquear scroll del body en este screen */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /** Rotador de frases */
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 2800);
    return () => clearInterval(id);
  }, []);

  const phrase = useMemo(() => phrases[idx], [idx]);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overscrollBehavior: "none",
      }}
    >
      {/* === Efectos de botones (CSS embebido, sin globales) === */}
      <style>{`
        /* Glow pulsante (verde) */
        @keyframes btn-glow {
          0%, 100% {
            box-shadow: 0 0 0 rgba(16,185,129,0), 0 0 0 rgba(16,185,129,0);
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 18px rgba(16,185,129,0.35), 0 0 42px rgba(16,185,129,0.20);
            filter: brightness(1.04);
          }
        }
        .btn-glow-emerald { animation: btn-glow 2.4s ease-in-out infinite; }

        /* Glow sutil (para botón claro) */
        @keyframes btn-glow-ghost {
          0%, 100% {
            box-shadow: 0 0 0 rgba(16,185,129,0), 0 0 0 rgba(16,185,129,0);
          }
          50% {
            box-shadow: 0 0 12px rgba(16,185,129,0.20), 0 0 28px rgba(16,185,129,0.12);
          }
        }
        .btn-glow-ghost { animation: btn-glow-ghost 2.8s ease-in-out infinite; }

        /* Destello en barrido (shine) al hover */
        .btn-shine {
          position: relative;
          overflow: hidden; /* recorta el destello dentro del botón */
          isolation: isolate;
        }
        .btn-shine::before {
          content: "";
          position: absolute;
          inset: -120% auto auto -30%;
          width: 40%;
          height: 300%;
          transform: rotate(25deg) translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0) 100%
          );
          transition: transform .75s ease;
          opacity: .65;
          pointer-events: none;
          z-index: 1;
        }
        .btn-shine:hover::before {
          transform: rotate(25deg) translateX(260%);
        }

        /* Halo al hover */
        .btn-halo:hover {
          box-shadow:
            0 10px 26px -8px rgba(16,185,129,.35),
            0 0 0 1px rgba(16,185,129,.20);
        }
      `}</style>

      {/* Capa de oscurecido suave para contraste */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Safe area container */}
      <div className="relative z-10 h-full w-full px-5 py-6 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mt-2">
          <img src={inBioLogo} alt="In-Bio" className="h-12 w-12 object-contain drop-shadow" />
          <span className="text-white/95 font-extrabold text-2xl tracking-tight select-none">
            In-<span className="text-green-200">Bio</span>
          </span>
        </div>

        {/* Hero */}
        <div className="flex-1 grid place-items-center w-full">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
            {/* Texto */}
            <div className="text-center md:text-left max-w-[520px]">
              <h1
                className="font-black text-4xl md:text-6xl leading-tight drop-shadow-sm select-none"
                style={{ color: "#fff" }}
              >
                Tu asistente financiero con <span className="text-green-200">Pesito</span>
              </h1>

              {/* Frase rotando */}
              <div className="mt-4 h-[56px] flex items-center justify-center md:justify-start opacity-50">
                <span className="px-3 py-2 rounded-xl bg-white/90 text-[15px] md:text-base text-[#0f2a1f] font-medium shadow-sm transition-all">
                  {phrase}
                </span>
              </div>

              {/* Chips de features */}
              <div className="mt-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <Chip icon={<TrendingUp className="h-4 w-4" />} label="Insights en tiempo real" />
                <Chip icon={<Shield className="h-4 w-4" />} label="Datos seguros" />
                <Chip icon={<Sparkles className="h-4 w-4" />} label="IA personalizada" />
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="h-12 px-7 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition btn-shine btn-glow-emerald btn-halo"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${P.moss}, ${P.meadow})`,
                    color: "#fff",
                  }}
                >
                  Empezar ahora 🌱
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/About")}
                  className="h-12 px-7 rounded-xl text-base font-semibold bg-white/90 hover:bg-white btn-shine btn-glow-ghost btn-halo"
                  style={{ color: P.pine }}
                >
                  Saber más
                </Button>
              </div>
            </div>

            {/* Lottie plantita */}
            <div className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] select-none pointer-events-none">
              <Lottie
                animationData={plantAnim}
                loop
                autoplay
                style={{ width: "100%", height: "100%", filter: "drop-shadow(0 8px 20px rgba(0,0,0,.15))" }}
              />
            </div>
          </div>
        </div>

        {/* Footer mini (opcional, no desplaza) */}
        <div className="pb-2 text-white/70 text-xs select-none">
          © {new Date().getFullYear()} In-Bio · Finanzas más verdes
        </div>
      </div>
    </div>
  );
}

/** Chip pill */
function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-[#123524] shadow-sm">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </span>
  );
}