// src/components/InvoiceCarousel.tsx
// Carrusel simplificado y más animado: menos ruido visual, tipografías más grandes,
// micro-animaciones suaves. Mantiene búsqueda, carga por UUID y guardado en localStorage.

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Receipt, Loader2, Search, Download, Trash2, Save } from "lucide-react";

// --- types ---
export type EInvoice = {
  uuid: string;     // CUFE/UUID simulado
  vendor: string;
  nit: string;
  amount: number;
  date: string;     // ISO
  category?: string;
};

// --- helpers ---
const toCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

function fuzzyIncludes(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

function rndNit() {
  const base = Math.floor(800000000 + Math.random() * 199999999);
  const dv = Math.floor(Math.random() * 10);
  return `${base}-${dv}`;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// --- “backend” simulado ---
const MOCK_DB: EInvoice[] = [
  { uuid: "cufe-0001", vendor: "Gastronomía Italiana S.A.S.", nit: "901123456-7", amount: 39_900, date: "2025-11-02", category: "Alimentos" },
  { uuid: "cufe-0002", vendor: "Transloja LTDA",             nit: "900555333-1", amount: 72_000, date: "2025-11-02", category: "Transporte" },
  { uuid: "cufe-0003", vendor: "Café Andino",                nit: "800123987-0", amount: 12_500, date: "2025-11-01", category: "Alimentos" },
  { uuid: "cufe-0004", vendor: "TecnoMarket",                nit: "901777222-3", amount: 1_950_000, date: "2025-10-29", category: "Tecnología" },
  { uuid: "cufe-0005", vendor: "EcoHogar S.A.",              nit: "901888111-9", amount: 210_000, date: "2025-11-02", category: "Hogar" },
  { uuid: "cufe-0006", vendor: "Servicios del Valle",        nit: "900222444-5", amount: 98_300,  date: "2025-11-01", category: "Servicios" },
];

function findByUUIDMock(uuid: string): EInvoice | null {
  const hit = MOCK_DB.find(m => m.uuid.toLowerCase() === uuid.toLowerCase());
  if (hit) return hit;
  if (!uuid.trim()) return null;
  return {
    uuid,
    vendor: "Proveedor Simulado",
    nit: rndNit(),
    amount: 50_000 + Math.round(Math.random() * 950_000),
    date: todayISO(),
    category: "Otros",
  };
}

// --- búsqueda simulada ---
function useEInvoiceSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EInvoice[]>([]);

  const search = async (q: string) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // simula red
      const filtered = MOCK_DB.filter(
        (row) => fuzzyIncludes(row.vendor, q) || fuzzyIncludes(row.nit, q) || fuzzyIncludes(row.uuid, q)
      );
      setResults(filtered);
    } catch (e: any) {
      setError(e?.message ?? "Fallo al buscar");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, results, search, setResults } as const;
}

// --- almacenamiento persistente (localStorage) ---
const LS_KEY = "inbio_invoices_saved";

function useSavedInvoices() {
  const [saved, setSaved] = useState<EInvoice[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as EInvoice[];
      return Array.isArray(parsed) ? parsed.filter(x => x?.uuid && x?.vendor) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
    } catch {/* ignore */}
  }, [saved]);

  const upsert = (inv: EInvoice) => {
    setSaved(prev => {
      const map = new Map(prev.map(i => [i.uuid, i] as const));
      map.set(inv.uuid, inv);
      return Array.from(map.values());
    });
  };

  const remove = (uuid: string) => setSaved(prev => prev.filter(i => i.uuid !== uuid));
  const clear = () => setSaved([]);

  return { saved, upsert, remove, clear } as const;
}

// --- UI subcomponentes (mínima info + animaciones) ---
function InvoiceCard({
  row,
  variant,
  onSave,
  onRemove,
}: {
  row: EInvoice;
  variant: "result" | "saved";
  onSave?: (r: EInvoice) => void;
  onRemove?: (uuid: string) => void;
}) {
  const isSaved = variant === "saved";
  return (
    <Card
      className={[
        "w-80 shrink-0 rounded-2xl border transition-all duration-300",
        "bg-white/90 backdrop-blur-sm hover:shadow-xl hover:-translate-y-0.5",
        isSaved ? "border-emerald-300" : "border-white/60",
        "animate-[cardIn_.4s_ease] will-change-transform",
      ].join(" ")}
    >
      <CardContent className="p-5">
        {/* header: icono + fecha */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/15 grid place-items-center text-emerald-700">
              <Receipt className="h-5 w-5" />
            </div>
            <p className="text-lg md:text-xl font-semibold truncate text-[#0f2a1f]">
              {row.vendor}
            </p>
          </div>
          <Badge className="text-xs md:text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
            {new Date(row.date).toLocaleDateString("es-CO")}
          </Badge>
        </div>

        {/* monto + categoría */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f2a1f]">
            {toCOP(row.amount)}
          </div>
          {row.category && (
            <span className="text-xs md:text-sm px-2.5 py-1 rounded-full bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
              {row.category}
            </span>
          )}
        </div>

        {/* acciones: solo iconos, sin texto */}
        <div className="mt-5 flex items-center justify-end gap-2">
          {isSaved ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove?.(row.uuid)}
              className="h-9 w-9 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave?.(row)}
              className="h-9 w-9 rounded-full text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition"
              title="Guardar"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvoiceCarousel() {
  // Lista "de hoy" (3)
  const [today] = useState<EInvoice[]>(MOCK_DB.filter(m => m.date === "2025-11-02").slice(0, 3));

  // Búsqueda
  const { loading, error, results, search, setResults } = useEInvoiceSearch();
  const [q, setQ] = useState("");

  // Guardadas
  const { saved, upsert, remove, clear } = useSavedInvoices();
  const savedTotal = useMemo(() => saved.reduce((acc, r) => acc + (r.amount || 0), 0), [saved]);

  // Carga por UUID
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadId.trim()) return;
    setUploading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const sim = findByUUIDMock(uploadId.trim());
      if (sim) upsert(sim);
      setUploadId("");
    } finally {
      setUploading(false);
    }
  };

  // Submit búsqueda
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    search(q.trim());
  };

  // Tests mínimos
  useEffect(() => {
    console.groupCollapsed("[InvoiceCarousel] smoke tests");
    console.assert(fuzzyIncludes("TecnoMarket", "tecno"), "fuzzyIncludes basic");
    console.assert(toCOP(1000).includes("1"), "toCOP basic");
    const fake = findByUUIDMock("cufe-xyz");
    console.assert(fake?.uuid === "cufe-xyz", "upload mock returns custom UUID");
    console.groupEnd();
  }, []);

  return (
    <div className="space-y-6">
      {/* estilos para animaciones sin CSS global */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rowPulse {
          0%,100% { box-shadow: 0 0 0 rgba(16,185,129,0); }
          50%     { box-shadow: 0 0 16px rgba(16,185,129,.12); }
        }
      `}</style>

      {/* Buscador y carga rápida */}
      <div className="grid gap-3 sm:grid-cols-5">
        <form onSubmit={onSubmit} className="sm:col-span-3 flex gap-2 animate-[rowPulse_2.8s_ease-in-out_infinite] rounded-xl">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Proveedor, NIT o CUFE/UUID"
            aria-label="Buscar"
            className="h-12 text-base bg-white/90 border border-white/60"
          />
          <Button type="submit" disabled={loading} className="h-12 px-4 text-base rounded-xl">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            <span className="ml-2 hidden sm:inline">Buscar</span>
          </Button>
        </form>

        <form onSubmit={handleUpload} className="sm:col-span-2 flex gap-2">
          <Input
            value={uploadId}
            onChange={(e) => setUploadId(e.target.value)}
            placeholder="Número de factura"
            aria-label="Número de factura"
            className="h-12 text-base bg-white/90 border border-white/60"
          />
          <Button type="submit" disabled={uploading} className="h-12 px-4 text-base rounded-xl">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            <span className="ml-2 hidden sm:inline">Cargar</span>
          </Button>
        </form>
      </div>

      {/* Hoy (minimal) */}
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-[#0f2a1f]">Hoy</span>
        {saved.length > 0 && (
          <div className="ml-auto text-sm text-[#0f2a1f]/70">
            Guardadas: <b>{saved.length}</b> · Total: <b>{toCOP(savedTotal)}</b>
            <Button variant="ghost" size="sm" className="ml-1 h-8" onClick={clear}>Limpiar</Button>
          </div>
        )}
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {today.map((row) => (
            <div key={`today-${row.uuid}`} className="snap-start">
              <InvoiceCard row={row} variant="result" onSave={upsert} />
            </div>
          ))}
        </div>
      </div>

      {/* Resultados (minimal) */}
      {(loading || results.length > 0 || error) && (
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#0f2a1f]">Resultados</span>
          {error && <span className="text-sm text-red-600">· {error}</span>}
          {results.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setResults([])} className="ml-auto h-8">
              Limpiar
            </Button>
          )}
        </div>
      )}

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-44 w-80 rounded-2xl" />
              ))}
            </>
          )}
          {!loading && results.length === 0 && !error && (
            <div className="text-base text-[#0f2a1f]/70">Busca o carga un número de factura.</div>
          )}
          {!loading &&
            results.map((row) => (
              <div key={`result-${row.uuid}`} className="snap-start">
                <InvoiceCard row={row} variant="result" onSave={upsert} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}