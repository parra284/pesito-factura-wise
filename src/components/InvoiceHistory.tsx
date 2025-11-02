import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt } from "lucide-react";
import factura1 from "@/assets/factura1.jpeg";
import factura2 from "@/assets/factura2.jpeg";

// Mock data para historial de facturas
const mockHistory = [
  {
    date: "2025-11-02",
    invoices: [
      { id: 1, vendor: "Gastronomía Italiana", amount: 39900, category: "Alimentos", image: factura1 },
      { id: 2, vendor: "Carolina Cruz", amount: 7200, category: "Alimentos", image: factura2 },
      { id: 3, vendor: "Gastronomía Italiana", amount: 39900, category: "Alimentos", image: factura1 }
    ]
  },
  {
    date: "2025-11-01",
    invoices: [
      { id: 4, vendor: "Carolina Cruz", amount: 7200, category: "Alimentos", image: factura2 },
      { id: 5, vendor: "Gastronomía Italiana", amount: 39900, category: "Alimentos", image: factura1 }
    ]
  },
  {
    date: "2025-10-31",
    invoices: [
      { id: 6, vendor: "Carolina Cruz", amount: 7200, category: "Alimentos", image: factura2 },
      { id: 7, vendor: "Gastronomía Italiana", amount: 39900, category: "Alimentos", image: factura1 },
      { id: 8, vendor: "Carolina Cruz", amount: 7200, category: "Alimentos", image: factura2 }
    ]
  }
];

const InvoiceHistory = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<{ vendor: string; image: string } | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Historial de Facturas</h2>
      
      {mockHistory.map((day) => (
        <div key={day.date} className="space-y-3">
          <h3 className="text-lg font-medium text-muted-foreground sticky top-20 bg-background/95 backdrop-blur-sm py-2 z-10">
            {new Date(day.date).toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          <div className="grid gap-3">
            {day.invoices.map((invoice) => (
              <Card 
                key={invoice.id} 
                className="hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer"
                onClick={() => setSelectedInvoice({ vendor: invoice.vendor, image: invoice.image })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {invoice.vendor}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${invoice.amount.toLocaleString('es-CO')}
                      </p>
                      <p className="text-xs text-muted-foreground">COP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

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
