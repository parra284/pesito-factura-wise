import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

import factura1 from "@/assets/factura1.jpeg";
import factura2 from "@/assets/factura2.jpeg";

/* ------------------------------------------------------------------ */
/* 1) Configuración de categorías                                     */
/* ------------------------------------------------------------------ */
const CATEGORY_OPTIONS = [
  { id: "alimentos",  name: "Alimentos",  emoji: "🍔", color: "bg-emerald-100 text-emerald-800" },
  { id: "transporte", name: "Transporte", emoji: "🚌", color: "bg-sky-100 text-sky-800" },
  { id: "moda",       name: "Moda",       emoji: "👗", color: "bg-fuchsia-100 text-fuchsia-800" },
  { id: "viajes",     name: "Viajes",     emoji: "✈️", color: "bg-teal-100 text-teal-800" },
  { id: "servicios",  name: "Servicios",  emoji: "⚙️", color: "bg-zinc-100 text-zinc-800" },
  { id: "otros",      name: "Otros",      emoji: "🏷️", color: "bg-slate-100 text-slate-800" },
];
const CAT_BY_ID = Object.fromEntries(CATEGORY_OPTIONS.map(c => [c.id, c]));

const CAT_STORAGE_KEY = "unidining_invoice_categories";
type CatMap = Record<string, string>; // invoiceId -> categoryId
const loadCatMap = (): CatMap => { try { return JSON.parse(localStorage.getItem(CAT_STORAGE_KEY) || "{}"); } catch { return {}; } };
const saveCatMap = (m: CatMap) => localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(m));

/* ------------------------------------------------------------------ */
/* 2) Mock de datos                                                   */
/* ------------------------------------------------------------------ */
const mockHistory = [
  {
    date: "2025-11-02",
    invoices: [
      { id: 1, vendor: "Gastronomía Italiana", amount: 39900, category: "alimentos", image: factura1 },
      { id: 2, vendor: "Carolina Cruz",         amount:  7200, category: "alimentos", image: factura2 },
      { id: 3, vendor: "Gastronomía Italiana", amount: 39900, category: "alimentos", image: factura1 },
    ],
  },
  {
    date: "2025-11-01",
    invoices: [
      { id: 4, vendor: "Carolina Cruz",         amount:  7200, category: "alimentos", image: factura2 },
      { id: 5, vendor: "Gastronomía Italiana", amount: 39900, category: "alimentos", image: factura1 },
    ],
  },
  {
    date: "2025-10-31",
    invoices: [
      { id: 6, vendor: "Carolina Cruz",         amount:  7200, category: "alimentos", image: factura2 },
      { id: 7, vendor: "Gastronomía Italiana", amount: 39900, category: "alimentos", image: factura1 },
      { id: 8, vendor: "Carolina Cruz",         amount:  7200, category: "alimentos", image: factura2 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 3) UI auxiliares                                                   */
/* ------------------------------------------------------------------ */
function CategoryBadge({ categoryId }: { categoryId: string }) {
  const meta = CAT_BY_ID[categoryId] || CAT_BY_ID["otros"];
  return (
    <Badge className={`rounded-full font-medium ${meta.color} hover:${meta.color}`}>
      <span className="mr-1">{meta.emoji}</span>
      {meta.name}
    </Badge>
  );
}

function CategoryPicker({
  value, onChange, onClickCapture,
}: {
  value: string;
  onChange: (v: string) => void;
  onClickCapture?: (e: any) => void;
}) {
  const meta = CAT_BY_ID[value] || CAT_BY_ID["otros"];
  return (
    <div onClickCapture={onClickCapture} className="min-w-[9.5rem]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 rounded-full bg-muted/60 border-0 px-3 text-sm">
          <SelectValue placeholder="Categoría">
            <div className="flex items-center gap-2">
              <span>{meta.emoji}</span>
              <span>{meta.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {CATEGORY_OPTIONS.map(opt => (
            <SelectItem key={opt.id} value={opt.id}>
              <div className="flex items-center gap-2">
                <span>{opt.emoji}</span>
                <span>{opt.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4) Página: Historial (mobile-first) + categorías desplegables      */
/* ------------------------------------------------------------------ */
const InvoiceHistory = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<{ vendor: string; image: string } | null>(null);
  const [catMap, setCatMap] = useState<CatMap>(() => loadCatMap());

  // Inicializa categorías por defecto si no hay en storage
  useEffect(() => {
    const initial: CatMap = { ...catMap };
    mockHistory.forEach(day =>
      day.invoices.forEach(inv => {
        if (!initial[inv.id]) initial[inv.id] = inv.category || "otros";
      })
    );
    setCatMap(initial);
    saveCatMap(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCategory = (id: number, catId: string) => {
    const next = { ...catMap, [id]: catId };
    setCatMap(next);
    saveCatMap(next);
  };

  // Totales por categoría + facturas agrupadas por categoría
  const { totals, invoicesByCat } = useMemo(() => {
    const t: Record<string, number> = {};
    const by: Record<string, Array<{ id:number; vendor:string; amount:number; date:string }>> = {};
    mockHistory.forEach(day => {
      day.invoices.forEach(inv => {
        const cat = catMap[inv.id] || inv.category || "otros";
        t[cat] = (t[cat] || 0) + inv.amount;
        (by[cat] = by[cat] || []).push({
          id: inv.id, vendor: inv.vendor, amount: inv.amount, date: day.date,
        });
      });
    });
    return { totals: t, invoicesByCat: by };
  }, [catMap]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Historial de facturas</h2>
      </header>

      {/* Listado cronológico (intacto) */}
      {mockHistory.map(day => (
        <section key={day.date} className="space-y-3">
          <h3 className="text-base sm:text-lg font-medium text-muted-foreground sticky top-16 bg-background/95 backdrop-blur-sm py-2 z-10">
            {new Date(day.date).toLocaleDateString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          <div className="flex flex-col gap-3">
            {day.invoices.map((invoice) => {
              const categoryId = catMap[invoice.id] || invoice.category || "otros";
              return (
                <Card
                  key={invoice.id}
                  className="border-border/50 hover:border-primary/30 transition-all shadow-none hover:shadow-sm"
                  onClick={() => setSelectedInvoice({ vendor: invoice.vendor, image: invoice.image })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold truncate">{invoice.vendor}</h4>
                          <div className="mt-1 flex items-center gap-2">
                            <CategoryBadge categoryId={categoryId} />
                            <span className="text-xs text-muted-foreground">ID #{invoice.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-primary leading-none">
                          ${invoice.amount.toLocaleString("es-CO")}
                        </p>
                        <p className="text-xs text-muted-foreground">COP</p>
                      </div>
                    </div>

                    {/* Selector de categoría (drop-down) */}
                    <div className="mt-3">
                      <CategoryPicker
                        value={categoryId}
                        onChange={(v) => setCategory(invoice.id, v)}
                        onClickCapture={(e) => e.stopPropagation()} // evita abrir modal
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {/* ---- NUEVO: Categorías desplegables (acordeón simple con <details>) ---- */}
      <section className="mt-8 space-y-2">
        <h3 className="text-base sm:text-lg font-semibold">Por categoría (desplegable)</h3>

        {Object.entries(totals).map(([catId, total]) => {
          const meta = CAT_BY_ID[catId] || CAT_BY_ID["otros"];
          const items = invoicesByCat[catId] || [];

          return (
            <details key={catId} className="rounded-xl border bg-card p-3 open:shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="font-medium">{meta.name}</span>
                </div>
                <span className="text-primary font-semibold">
                  ${total.toLocaleString("es-CO")}
                </span>
              </summary>

              <div className="mt-3 space-y-2">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-lg border bg-background px-3 py-2 flex items-center justify-between text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{it.vendor}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(it.date).toLocaleDateString("es-CO")}
                        {" · ID #"}{it.id}
                      </p>
                    </div>
                    <span className="text-primary font-semibold">
                      ${it.amount.toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </section>

      {/* Modal de vista previa (intacto) */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedInvoice?.vendor}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="mt-4">
              <img
                src={selectedInvoice.image}
                alt={selectedInvoice.vendor}
                className="w-full h-auto rounded-lg border border-border/30"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceHistory;