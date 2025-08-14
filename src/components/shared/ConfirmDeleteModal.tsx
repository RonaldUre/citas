import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  entityName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  footer?: ReactNode; // opcional si se quiere customizar
}

export function ConfirmDeleteModal({
  isOpen,
  title = "¿Eliminar elemento?",
  description = "Esta acción no se puede deshacer.",
  entityName,
  onCancel,
  onConfirm,
  confirmLabel = "Sí, eliminar",
  cancelLabel = "Cancelar",
  disabled = false,
  footer,
}: ConfirmDeleteModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-4">
        <p className="text-sm">
          {description}
          {entityName && (
            <>
              {" "}
              <strong>{entityName}</strong>
            </>
          )}
        </p>

        {footer ?? (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={disabled}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
