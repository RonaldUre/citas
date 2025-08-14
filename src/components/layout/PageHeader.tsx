import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  right?: React.ReactNode; // acciones opcionales a la derecha
}

export function PageHeader({ title, backTo = "/", right }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xl flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(backTo)}
      >
        ← Regresar
      </Button>

      <h1 className="text-lg font-semibold text-center flex-1">{title}</h1>

      {/* Mantener espacio aunque no haya acciones */}
      <div className="w-[80px] flex justify-end">{right}</div>
    </div>
  );
}
