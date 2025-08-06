import { useCallback, useEffect, useState } from "react";
import { appointmentService } from "../service/appointmentService";
import type { AppointmentStatus } from "../types/appointmentTypes";

type Filters = {
  userId?: number;
  clientId?: number;
  status?: AppointmentStatus;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  extendedProps: {
    id: number; // ✅ necesario para poder hacer update status
    client: string;
    professional: string;
    status: AppointmentStatus;
  };
};

export const useAppointmentCalendar = (
  from: string,
  to: string,
  filters?: Filters
) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAll({
        from,
        to,
        userId: filters?.userId,
        clientId: filters?.clientId,
        status: filters?.status,
        page: 1,
        limit: 100,
      });

      const mappedEvents: CalendarEvent[] = res.data
        .filter((a) => a.client && a.user)
        .map((a) => ({
          id: String(a.id),
          title: `Cita con ${a.client.name}`,
          start: a.date,
          end: calculateEnd(a.date, 45),
          backgroundColor: getStatusColor(a.status),
          extendedProps: {
            id: a.id, // ✅ aquí está la clave para poder hacer PATCH
            client: a.client.name,
            professional: a.user.name,
            status: a.status,
          },
        }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  }, [from, to, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    loading,
    refetch: fetchData,
  };
};

// 🔹 Calcula fin de cita
function calculateEnd(start: string, minutes: number): string {
  const startDate = new Date(start);
  return new Date(startDate.getTime() + minutes * 60000).toISOString();
}

// 🔹 Asigna color por estado
function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "#facc15";
    case "CONFIRMED":
      return "#22c55e";
    case "CANCELLED":
      return "#ef4444";
    case "COMPLETED":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}
