import { useEffect, useState } from "react";
import { getClientAppointments } from "../services/clientService";
import type { AppointmentResponse } from "@/features/appointment/types/appointmentTypes"
import { BaseModal } from "@/components/shared/BaseModal";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName: string;
}

export function ClientHistoryModal({
  isOpen,
  onClose,
  clientId,
  clientName,
}: Props) {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await getClientAppointments(clientId);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error al cargar el historial del cliente", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isOpen, clientId]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Historial de ${clientName}`}
      description="Listado de citas realizadas por este cliente."
    >
      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">Este cliente no tiene citas registradas.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="border rounded-md p-3 shadow-sm bg-white"
            >
              <p>
                <strong>Servicio:</strong>{" "}
                {appt.service?.name ?? "No especificado"}
              </p>
              <p>
                <strong>Profesional:</strong> {appt.user.name}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {format(new Date(appt.date), "PPpp", { locale: es })}
              </p>
              <p>
                <strong>Estado:</strong> {translateStatus(appt.status)}
              </p>
              {appt.tag && (
                <p>
                  <strong>Etiqueta:</strong> {appt.tag}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  );
}

function translateStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "CONFIRMED":
      return "Confirmada";
    case "COMPLETED":
      return "Completada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
}
