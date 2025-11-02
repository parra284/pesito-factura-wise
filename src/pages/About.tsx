// src/pages/About.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Leaf, Shield, Sparkles, TrendingUp, ScanLine, Goal, Download, HelpCircle } from "lucide-react";
import inBioLogo from "@/assets/in-bio-logo.png";
import bgLogin from "@/assets/bg-login.png";

const P = {
  pine: "#183a2b",
  moss: "#2f6e4e",
  meadow: "#4da370",
};

export default function About() {
  const navigate = useNavigate();

  // bloquea scroll vertical si quieres estilo landing fija (puedes quitarlo si la sección es muy larga)
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = prev; };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CSS embebido: brillos botones */}
      <style>{`
        @keyframes btn-glow {0%,100%{box-shadow:0 0 0 rgba(16,185,129,0),0 0 0 rgba(16,185,129,0);filter:brightness(1)}50%{box-shadow:0 0 18px rgba(16,185,129,.35),0 0 42px rgba(16,185,129,.2);filter:brightness(1.04)}}
        .btn-glow-emerald{animation:btn-glow 2.4s ease-in-out infinite}
        .btn-shine{position:relative;overflow:hidden;isolation:isolate}
        .btn-shine::before{content:"";position:absolute;inset:-120% auto auto -30%;width:40%;height:300%;transform:rotate(25deg) translateX(-100%);background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 100%);transition:transform .75s ease;opacity:.65;pointer-events:none;z-index:1}
        .btn-shine:hover::before{transform:rotate(25deg) translateX(260%)}
        .btn-halo:hover{box-shadow:0 10px 26px -8px rgba(16,185,129,.35),0 0 0 1px rgba(16,185,129,.20)}
      `}</style>

      <div className="absolute inset-0 bg-black/10" />

      {/* Header simple */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={inBioLogo} alt="In-Bio" className="h-10 w-10 object-contain" />
            <span className="text-white font-extrabold text-xl tracking-tight">
              In-<span className="text-green-200">Bio</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              style={{ color: P.pine }}
            >
              Inicio
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="btn-shine btn-glow-emerald btn-halo"
              style={{ backgroundImage: `linear-gradient(45deg, ${P.moss}, ${P.meadow})`, color: "#fff" }}
            >
              Empezar ahora 🌱
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 pt-6 pb-10 md:pt-10 md:pb-14 text-center">
          <h1 className="text-white font-black text-4xl md:text-6xl leading-tight">
            Finanzas simples, decisiones inteligentes
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-4 max-w-3xl mx-auto">
            Clasifica facturas en segundos, gana puntos por compras sostenibles y recibe recomendaciones con IA de <b>Pesito</b>.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              style={{ color: P.pine }}
            >
              Ver cómo funciona
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="btn-shine btn-glow-emerald btn-halo"
              style={{ backgroundImage: `linear-gradient(45deg, ${P.moss}, ${P.meadow})`, color: "#fff" }}
            >
              Empezar ahora 🌱
            </Button>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
          <h2 className="text-white text-2xl md:text-3xl font-bold text-center">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <StepCard icon={<ScanLine className="h-6 w-6" />} title="1. Sube o escanea tus facturas">
              Carga facturas electrónicas o usa la cámara para digitalizar recibos físicos.
            </StepCard>
            <StepCard icon={<Sparkles className="h-6 w-6" />} title="2. Clasificación automática">
              Pesito clasifica por categoría, detecta patrones y prepara insights.
            </StepCard>
            <StepCard icon={<TrendingUp className="h-6 w-6" />} title="3. Insights, metas y puntos">
              Revisa análisis, proyecciones y avanza en tus metas ganando puntos verdes.
            </StepCard>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
          <h2 className="text-white text-2xl md:text-3xl font-bold text-center">Beneficios clave</h2>
          <div className="grid md:grid-cols-4 gap-5 mt-8">
            <BenefitCard icon={<TrendingUp className="h-5 w-5" />} title="Gasta mejor con IA">
              Proyecciones de gasto, alertas y recomendaciones personalizadas.
            </BenefitCard>
            <BenefitCard icon={<Leaf className="h-5 w-5" />} title="Puntos verdes & recompensas">
              Suma puntos por compras sostenibles y canjéalos por beneficios.
            </BenefitCard>
            <BenefitCard icon={<Goal className="h-5 w-5" />} title="Metas & plan de estudio">
              Rutinas personalizadas, checklist diario y recordatorios smart.
            </BenefitCard>
            <BenefitCard icon={<Download className="h-5 w-5" />} title="Integraciones & exportación">
              KDS/Facturación electrónica y exporta CSV/Excel en un clic.
            </BenefitCard>
          </div>
        </div>
      </section>

      {/* IMPACTO VERDE */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-white font-bold text-xl md:text-2xl">Tu impacto verde</h3>
            <p className="text-white/90 mt-2">
              Cada compra sostenible suma <b>puntos verdes</b>. Convierte tus decisiones en métricas claras:
              árboles virtuales, CO₂ estimado evitado y retos ecológicos.
            </p>
            <ul className="mt-4 space-y-2 text-white/90">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-200" /> Seguimiento de categorías sostenibles</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-200" /> Retos mensuales y logros</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-200" /> Ranking amistoso con amigos/equipo</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/90 p-5">
            <h4 className="font-semibold text-[#0f2a1f]">Ejemplo de puntos</h4>
            <p className="text-[#0f2a1f]/80 text-sm mt-2">
              • Factura en tienda eco: +120 pts<br />
              • Compra local: +80 pts<br />
              • Reutilizables/reciclables: +60 pts
            </p>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14 grid md:grid-cols-2 gap-6 items-center">
          <div className="rounded-2xl bg-white/90 p-5 order-2 md:order-1">
            <h4 className="font-semibold text-[#0f2a1f]">Seguridad & privacidad</h4>
            <ul className="mt-3 space-y-2 text-[#0f2a1f]/85 text-sm">
              <li className="flex items-start gap-2"><Shield className="h-5 w-5 text-emerald-700" /> Cifrado en tránsito y en reposo</li>
              <li className="flex items-start gap-2"><Shield className="h-5 w-5 text-emerald-700" /> Tus datos son tuyos: descarga/eliminación en 1 clic</li>
              <li className="flex items-start gap-2"><Shield className="h-5 w-5 text-emerald-700" /> Buenas prácticas y principio de mínima recolección</li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-white font-bold text-xl md:text-2xl">Confianza primero</h3>
            <p className="text-white/90 mt-2">
              Diseñamos In-Bio con seguridad por defecto. Solo tú controlas qué subes y qué compartes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
          <h2 className="text-white text-2xl md:text-3xl font-bold text-center">Preguntas frecuentes</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <FaqItem q="¿Cómo se calculan los puntos?" a="Asignamos puntajes a categorías y atributos sostenibles. Puedes ver el detalle en tu panel de puntos." />
            <FaqItem q="¿Puedo subir facturas físicas?" a="Sí. Usa el escáner dentro de la app; no suman puntos por sostenibilidad, pero cuentan para tu análisis financiero." />
            <FaqItem q="¿Necesito conectar mi banco?" a="No es obligatorio. Puedes empezar solo con facturas. La conexión bancaria (cuando esté) te dará más precisión." />
            <FaqItem q="¿Qué tan precisas son las recomendaciones?" a="Pesito aprende de tus patrones. Cuantas más facturas clasifiques, mejores serán los insights." />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 py-12 text-center">
          <h3 className="text-white text-2xl md:text-3xl font-bold">Empieza gratis en 1 minuto</h3>
          <p className="text-white/90 mt-2">Toma el control de tus finanzas y suma puntos verdes desde hoy.</p>
          <div className="mt-6">
            <Button
              onClick={() => navigate("/login")}
              className="btn-shine btn-glow-emerald btn-halo"
              style={{ backgroundImage: `linear-gradient(45deg, ${P.moss}, ${P.meadow})`, color: "#fff" }}
            >
              Crear cuenta
            </Button>
          </div>
          <p className="text-white/70 text-xs mt-6">© {new Date().getFullYear()} In-Bio · Finanzas más verdes</p>
        </div>
      </section>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function StepCard({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/90 p-5 border border-white/60 shadow-sm">
      <div className="flex items-center gap-2 text-[#0f2a1f]">
        <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-600/15 text-emerald-700">
          {icon}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-[#0f2a1f]/85 text-sm mt-2">{children}</p>
    </div>
  );
}

function BenefitCard({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/90 p-5 border border-white/60 shadow-sm">
      <div className="flex items-center gap-2 text-[#0f2a1f]">
        <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-600/15 text-emerald-700">
          {icon}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-[#0f2a1f]/85 text-sm mt-2">{children}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl bg-white/90 p-5 border border-white/60 shadow-sm">
      <div className="flex items-start gap-2">
        <HelpCircle className="h-5 w-5 text-emerald-700 mt-0.5" />
        <div>
          <h4 className="font-semibold text-[#0f2a1f]">{q}</h4>
          <p className="text-[#0f2a1f]/85 text-sm mt-1">{a}</p>
        </div>
      </div>
    </div>
  );
}