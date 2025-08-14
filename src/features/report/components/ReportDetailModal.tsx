// features/report/components/ReportDetailModal.tsx
import { useEffect, useState } from "react";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

import type { ReportDetail } from "../types/report";
import { getReportById } from "../services/ReportService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Si pasas el id, el modal hace fetch al abrir */
  reportId?: number;
  /** Si ya tienes el dato cargado, puedes pasarlo para evitar un fetch extra */
  initialReport?: ReportDetail | null;
};

export function ReportDetailModal({
  isOpen,
  onClose,
  reportId,
  initialReport,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportDetail | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialReport) {
      // Sync cuando recibimos datos pre-cargados
      setData(initialReport);
      setLoading(false);
      return;
    }

    if (reportId) {
      // Fetch solo si no hay initialReport
      setLoading(true);
      getReportById(reportId)
        .then(setData)
        .catch((err) => {
          console.error(err);
          toast.error("No se pudo cargar el reporte");
          setData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, reportId, initialReport]);
  const renderDateTime = (iso?: string | Date | null) => {
    if (!iso) return "—";
    const d = typeof iso === "string" ? new Date(iso) : iso;
    return d.toLocaleString();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del reporte"
      description="Información del reporte y de la cita asociada."
    >
      {loading ? (
        <Loader />
      ) : !data ? (
        <p className="text-sm text-muted-foreground">
          No se encontró información del reporte.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Sección Reporte */}
          <section className="rounded-lg border p-4 bg-white">
            <h3 className="text-sm font-semibold mb-3">Reporte</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="font-medium">ID:</span> {data.id}
              </div>
              <div>
                <span className="font-medium">Creado por:</span>{" "}
                {data.createdBy?.name ?? "—"}
              </div>
              <div>
                <span className="font-medium">Fecha de creación:</span>{" "}
                {renderDateTime(data.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Flags:</span>
                <Badge
                  variant={data.isForEventCancel ? "default" : "secondary"}
                >
                  {data.isForEventCancel
                    ? "Por cancelación"
                    : "Sin cancelación"}
                </Badge>
                <Badge variant={data.hasRecovery ? "default" : "secondary"}>
                  {data.hasRecovery ? "Con seguimiento" : "Sin seguimiento"}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="font-medium mb-1">Descripción</div>
                <p className="whitespace-pre-wrap">{data.description}</p>
              </div>
            </div>
          </section>

          {/* Sección Cita asociada */}
          <section className="rounded-lg border p-4 bg-white">
            <h3 className="text-sm font-semibold mb-3">Cita asociada</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="font-medium">ID de cita:</span>{" "}
                {data.appointment?.id ?? data.appointmentId}
              </div>
              <div>
                <span className="font-medium">Fecha:</span>{" "}
                {renderDateTime(data.appointment?.date)}
              </div>
              <div>
                <span className="font-medium">Estado:</span>{" "}
                {data.appointment?.status ?? "—"}
              </div>
            </div>

            {/* Nota: si quieres mostrar cliente/profesional/servicio aquí,
                el backend de findOne debe incluirlos en el include de appointment. */}
          </section>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
