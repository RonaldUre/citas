/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventDropArg } from "@fullcalendar/core";
import { Button } from "@/components/ui/button";
import { formatISO } from "date-fns";
import { AppointmentForm } from "../components/AppointmentForm";
import type { AppointmentFormInput } from "../schemas/appointmentSchema";
import { BaseModal } from "@/components/shared/BaseModal";
import { useAppointmentCalendar } from "../hooks/useAppointmentCalendar";
import { toast } from "sonner";
import { appointmentService } from "../service/appointmentService";
import type { AppointmentStatus } from "../types/appointmentTypes";

const AppointmentCalendarPage = () => {
  const [dateRange, setDateRange] = useState({
    from: formatISO(new Date()),
    to: formatISO(new Date()),
  });

  const { events, refetch } = useAppointmentCalendar(
    dateRange.from,
    dateRange.to
  );

  // ---- Estado para modal de formulario
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [initialValues, setInitialValues] = useState<
    AppointmentFormInput | undefined
  >(undefined);
  const [formLoading, setFormLoading] = useState(false);

  // ---- Estado para modal de detalle (opcional)
  const [clickedEvent, setClickedEvent] = useState<{
    id: number;
    title: string;
    start?: Date;
    end?: Date;
    extendedProps: {
      client: string;
      professional: string;
      service: string;
      status: string;
    };
  } | null>(null);

  // Crear nueva cita
  const openCreate = useCallback((presetDate?: string) => {
    setEditingId(undefined);
    setInitialValues({
      date: presetDate ?? "",
      status: "PENDING",
      userId: undefined, 
      clientId: undefined, 
      serviceId: undefined,
      tag: "",
      isRecurring: false,
    });
    setFormOpen(true);
  }, []);

  // Editar cita existente (carga por id)
  const openEdit = useCallback(async (id: number) => {
    setFormLoading(true);
    setEditingId(id);
    setFormOpen(true);
    try {
      const appt = await appointmentService.getById(id); // 👈 sin .data si tu service ya devuelve la entidad
      const values: AppointmentFormInput = {
        date: appt.date, // si viene Date, conviértelo a ISO string
        status: appt.status as AppointmentFormInput["status"],
        userId: appt.user?.id ?? appt.user.id ?? undefined,
        clientId: appt.client?.id ?? appt.client.id ?? undefined,
        serviceId: appt.service?.id ?? appt.service?.id ?? undefined,
        tag: appt.tag ?? "",
        isRecurring: appt.isRecurring ?? false,
      };
      setInitialValues(values);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cargar la cita");
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  }, []);

  // Click en evento: abre modal de detalle (y desde ahí puedes editar)
  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo;
    const id = Number(event.id ?? event.extendedProps?.id); // fallback
    setClickedEvent({
      id,
      title: event.title,
      start: event.start ?? undefined,
      end: event.end ?? undefined,
      extendedProps: {
        client: event.extendedProps.client,
        professional: event.extendedProps.professional,
        service: event.extendedProps.service,
        status: event.extendedProps.status,
      },
    });
  };

  // Drag & drop de evento para reprogramar
  const handleEventDrop = (info: EventDropArg) => {
    const id = Number(info.event.id ?? info.event.extendedProps?.id);
    const newDate = info.event.start?.toISOString();
    if (!id || !newDate) return;

    toast(`¿Deseas mover la cita a ${info.event.start?.toLocaleString()}?`, {
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            await appointmentService.update(id, { date: newDate });
            toast.success("Cita reprogramada");
            refetch();
          } catch (err) {
            console.error("Error al mover la cita", err);
            toast.error("No se pudo mover la cita");
            info.revert();
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => info.revert(),
      },
      duration: 10000,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Calendario de Citas</h2>
        <Button onClick={() => openCreate()}>+ Nueva Cita</Button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        selectable
        selectMirror
        editable
        events={events}
        height="auto"
        eventDrop={handleEventDrop}
        datesSet={(info) => {
          const from = formatISO(info.start);
          const to = formatISO(info.end);
          setDateRange((prev) =>
            prev && prev.from === from && prev.to === to ? prev : { from, to }
          );
        }}
        eventClick={handleEventClick}
        select={(info) => {
          // pre-llenamos fecha al crear: usa 12:00 para evitar horarios raros
          const date = new Date(info.start);
          date.setHours(12, 0, 0, 0);
          openCreate(date.toISOString());
        }}
      />

      {/* Modal de Detalle (opcional) */}
      <BaseModal
        isOpen={!!clickedEvent}
        onClose={() => setClickedEvent(null)}
        title="Detalle de la cita"
      >
        {clickedEvent && (
          <div className="space-y-4">
            <p>
              <strong>Cliente:</strong> {clickedEvent.extendedProps.client}
            </p>
            <p>
              <strong>Profesional:</strong>{" "}
              {clickedEvent.extendedProps.professional}
            </p>
            <p>
              <strong>Servicio:</strong>{" "}
              {clickedEvent.extendedProps.service ?? "N/A"}
            </p>
            <p>
              <strong>Inicio:</strong>{" "}
              {clickedEvent.start?.toLocaleString() ?? "N/A"}
            </p>
            <p>
              <strong>Fin:</strong>{" "}
              {clickedEvent.end?.toLocaleString() ?? "N/A"}
            </p>

            <div>
              <label className="font-medium text-sm text-gray-700 mb-1 block">
                Estado
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={clickedEvent.extendedProps.status}
                onChange={(e) =>
                  setClickedEvent((prev) =>
                    prev
                      ? {
                          ...prev,
                          extendedProps: {
                            ...prev.extendedProps,
                            status: e.target.value,
                          },
                        }
                      : null
                  )
                }
              >
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  try {
                    await appointmentService.updateStatus(
                      clickedEvent.id,
                      clickedEvent.extendedProps.status as AppointmentStatus
                    );
                    toast.success("Estado actualizado");
                    setClickedEvent(null);
                    refetch();
                  } catch (error) {
                    console.error(error);
                    toast.error("Error al actualizar estado");
                  }
                }}
                className="flex-1"
              >
                Actualizar Estado
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const id = clickedEvent.id;
                  setClickedEvent(null);
                  openEdit(id);
                }}
                className="flex-1"
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </BaseModal>

      {/* Modal de Formulario */}
      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Editar Cita" : "Nueva Cita"}
      >
        <AppointmentForm
          key={editingId ?? "new"} // remount limpio al cambiar de cita
          id={editingId}
          initialValues={initialValues}
          isEditing={!!editingId}
          loading={formLoading}
          onSuccess={() => {
            setFormOpen(false);
            refetch();
          }}
        />
      </BaseModal>
    </div>
  );
};

export default AppointmentCalendarPage;
