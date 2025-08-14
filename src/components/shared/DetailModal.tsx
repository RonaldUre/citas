import { BaseModal } from "@/components/shared/BaseModal";
import type { ReactNode } from "react";

interface Field {
  label: string;
  value: ReactNode;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  loading?: boolean;
  fields: Field[];
}

export function DetailModal({
  isOpen,
  onClose,
  title = "Detalle",
  loading = false,
  fields,
}: DetailModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando datos...</p>
      ) : (
        <div className="space-y-2">
          {fields.map((field, idx) => (
            <p key={idx}>
              <strong>{field.label}:</strong>{" "}
              {field.value || <span className="text-muted-foreground">—</span>}
            </p>
          ))}
        </div>
      )}
    </BaseModal>
  );
}
