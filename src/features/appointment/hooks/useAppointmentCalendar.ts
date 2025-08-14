
import { useCallback, useEffect, useRef, useState } from "react";
import { appointmentService } from "../service/appointmentService";
import type { AppointmentResponse, AppointmentStatus } from "../types/appointmentTypes";

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
    id: number;
    client: string;
    professional: string;
    service?: string;
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

  // siempre usar los últimos parámetros en refetch()
  const fromRef = useRef(from);
  const toRef = useRef(to);
  const filtersRef = useRef<Filters | undefined>(filters);

  useEffect(() => {
    fromRef.current = from;
    toRef.current = to;
    filtersRef.current = filters;
  }, [from, to, filters]);

  const requestIdRef = useRef(0);

  const mapToEvents = (rows: AppointmentResponse[]): CalendarEvent[] => {
    return rows.map((a) => ({
      id: String(a.id),
      title: `cita de ${a.client?.name ?? "Cliente"}`,
      start: a.date,
      end: calculateEnd(a.date, 45),
      backgroundColor: getStatusColor(a.status),
      extendedProps: {
        id: a.id,
        client: a.client?.name ?? "",
        professional: a.user?.name ?? "",
        service: a.service?.name ?? "N/A",
        status: a.status,
      },
    }));
  };

  const fetchWithParams = useCallback(
    async (fromParam: string, toParam: string, filtersParam?: Filters) => {
      if (!fromParam || !toParam) return;
      setLoading(true);
      const requestId = ++requestIdRef.current;
      try {
        const res = await appointmentService.getAll({
          from: fromParam,
          to: toParam,
          userId: filtersParam?.userId,
          clientId: filtersParam?.clientId,
          status: filtersParam?.status,
          page: 1,
          limit: 500,
        });
        if (requestId !== requestIdRef.current) return; // descarta respuestas antiguas
        // nueva referencia siempre
        setEvents(mapToEvents(res.data));
      } catch (err) {
        console.error("Error fetching appointments", err);
        setEvents([]); // deja vacío si falla
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    []
  );

  // fetch cuando cambian from/to/filters
  useEffect(() => {
    fetchWithParams(from, to, filters);
  }, [fetchWithParams, from, to, filters]);

  // refetch manual tras crear/editar/mover
  const refetch = useCallback(async () => {
    await fetchWithParams(fromRef.current, toRef.current, filtersRef.current);
  }, [fetchWithParams]);

  return { events, loading, refetch };
};

// utilidades
function calculateEnd(start: string, minutes: number): string {
  const startDate = new Date(start);
  return new Date(startDate.getTime() + minutes * 60000).toISOString();
}

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
