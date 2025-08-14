import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  className?: string;

  /** Personaliza textos si quieres */
  createLabel?: string;      // por defecto: "Crear"
  updateLabel?: string;      // por defecto: "Actualizar"
  creatingLabel?: string;    // por defecto: "Creando..."
  updatingLabel?: string;    // por defecto: "Actualizando..."

  /** Icono opcional a la izquierda cuando NO está cargando */
  iconLeft?: ReactNode;
}

export function SubmitButton({
  isSubmitting,
  isEditing = false,
  disabled,
  className,
  createLabel = "Crear",
  updateLabel = "Actualizar",
  creatingLabel = "Creando...",
  updatingLabel = "Actualizando...",
  iconLeft,
}: SubmitButtonProps) {
  const label = isSubmitting
    ? (isEditing ? updatingLabel : creatingLabel)
    : (isEditing ? updateLabel : createLabel);

  return (
    <Button
      type="submit"
      className={className}
      disabled={isSubmitting || disabled}
      aria-busy={isSubmitting}
      aria-disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <Spinner className="mr-2" />
      ) : (
        iconLeft && <span className="mr-2">{iconLeft}</span>
      )}
      {label}
    </Button>
  );
}

/** Spinner minimalista para no depender de otros componentes */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
