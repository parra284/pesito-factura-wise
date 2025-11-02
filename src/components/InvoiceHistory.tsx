import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";

// Mock data para historial de facturas
const mockHistory = [
  {
    date: "2025-11-02",
    invoices: [
      { id: 1, vendor: "Supermercado Central", amount: 125000, category: "Alimentos" },
      { id: 2, vendor: "Farmacia Salud", amount: 45000, category: "Salud" },
      { id: 3, vendor: "Gasolinera Express", amount: 80000, category: "Transporte" }
    ]
  },
  {
    date: "2025-11-01",
    invoices: [
      { id: 4, vendor: "Restaurante Del Sol", amount: 65000, category: "Alimentos" },
      { id: 5, vendor: "Tienda de Ropa", amount: 150000, category: "Vestuario" }
    ]
  },
  {
    date: "2025-10-31",
    invoices: [
      { id: 6, vendor: "Librería Estudiante", amount: 35000, category: "Educación" },
      { id: 7, vendor: "Café Aroma", amount: 18000, category: "Alimentos" },
      { id: 8, vendor: "Cine Megaplex", amount: 28000, category: "Entretenimiento" }
    ]
  }
];

const InvoiceHistory = () => {
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
    </div>
  );
};

export default InvoiceHistory;
