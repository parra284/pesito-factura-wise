import { Button } from "@/components/ui/button";
import pesitoBot from "@/assets/pesito-bot.png";

interface PesitoButtonProps {
  onClick: () => void;
}

const PesitoButton = ({ onClick }: PesitoButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-br from-primary to-primary-dark hover:scale-110 transition-all duration-300 p-0 overflow-hidden z-50 border-2 border-primary-foreground/20"
      aria-label="Abrir chat con Pesito"
    >
      <img
        src={pesitoBot}
        alt="Pesito"
        className="w-full h-full object-contain p-1"
      />
    </Button>
  );
};

export default PesitoButton;
