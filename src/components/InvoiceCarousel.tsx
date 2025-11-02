import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import factura1 from "@/assets/factura1.jpeg";
import factura2 from "@/assets/factura2.jpeg";

// Mock data para facturas con imágenes reales
const mockInvoices = [
  {
    id: 1,
    vendor: "Gastronomía Italiana",
    amount: 39900,
    date: "2025-11-01",
    category: "Alimentos",
    image: factura1
  },
  {
    id: 2,
    vendor: "Carolina Cruz",
    amount: 7200,
    date: "2025-11-01",
    category: "Alimentos",
    image: factura2
  },
  {
    id: 3,
    vendor: "Gastronomía Italiana",
    amount: 39900,
    date: "2025-11-01",
    category: "Alimentos",
    image: factura1
  },
  {
    id: 4,
    vendor: "Carolina Cruz",
    amount: 7200,
    date: "2025-11-01",
    category: "Alimentos",
    image: factura2
  }
];

const InvoiceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextInvoice = () => {
    setCurrentIndex((prev) => (prev + 1) % mockInvoices.length);
  };

  const prevInvoice = () => {
    setCurrentIndex((prev) => (prev - 1 + mockInvoices.length) % mockInvoices.length);
  };

  const currentInvoice = mockInvoices[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden shadow-lg border-border/50 bg-card">
        <CardContent className="p-0">
          <div className="relative">
            {/* Invoice Image */}
            <div className="aspect-[4/3] bg-muted relative overflow-hidden">
              <img
                src={currentInvoice.image}
                alt={currentInvoice.vendor}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevInvoice}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-md"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextInvoice}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-md"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md">
                {currentInvoice.category}
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {currentInvoice.vendor}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(currentInvoice.date).toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${currentInvoice.amount.toLocaleString('es-CO')}
                  </p>
                  <p className="text-xs text-muted-foreground">COP</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2 pt-2">
                {mockInvoices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCarousel;
