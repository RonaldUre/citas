/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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

const AppointmentCalendarPage = () => {
  const [dateRange, setDateRange] = useState({
    from: formatISO(new Date()),
    to: formatISO(new Date()),
  });

  const { events, refetch } = useAppointmentCalendar(
    dateRange.from,
    dateRange.to
  );

  const [clickedEvent, setClickedEvent] = useState<{
    id: number;
    title: string;
    start?: Date;
    end?: Date;
    extendedProps: {
      client: string;
      professional: string;
      status: string;
    };
  } | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<
    (AppointmentFormInput & { id?: number }) | null
  >(null);

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setFormOpen(true);
  };

  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo;
    setClickedEvent({
      id: event.extendedProps.id,
      title: event.title,
      start: event.start ?? undefined,
      end: event.end ?? undefined,
      extendedProps: {
        client: event.extendedProps.client,
        professional: event.extendedProps.professional,
        status: event.extendedProps.status,
      },
    });
  };
const handleEventDrop = (info: EventDropArg) => {
  const id = Number(info.event.id);
  const newDate = info.event.start?.toISOString();

  if (!id || !newDate) return;

  // Mostrar toast de confirmación
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
          info.revert(); // ⛔️ Revertir si hubo error
        }
      },
    },
    cancel: {
      label: "Cancelar",
      onClick: () => info.revert(), // 🔙 Si cancela el usuario
    },
    duration: 10000,
  });
};


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Calendario de Citas</h2>
        <Button onClick={handleNewAppointment}>+ Nueva Cita</Button>
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
        editable // ✅ habilita mover eventos
        events={events}
        height="auto"
        eventDrop={handleEventDrop} // ✅ nuevo
        datesSet={(info) => {
          setDateRange({
            from: formatISO(info.start),
            to: formatISO(info.end),
          });
        }}
        eventClick={handleEventClick}
        select={(info) => {
          const date = new Date(info.start);
          date.setHours(12, 0, 0, 0); // ⏰ Fuerza hora 12 PM
          setSelectedAppointment({
            date: date.toISOString(),
            status: "PENDING",
            userId: 0,
            clientId: 0,
            tag: "",
            isRecurring: false,
          });
          setFormOpen(true);
        }}
      />

      {/* Modal de Detalle con cambio de estado */}
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

            <Button
              onClick={async () => {
                try {
                  await appointmentService.update(clickedEvent.id, {
                    status: clickedEvent.extendedProps.status as any,
                  });
                  toast.success("Estado actualizado");
                  setClickedEvent(null);
                  refetch();
                } catch (error) {
                  console.error(error);
                  toast.error("Error al actualizar estado");
                }
              }}
              className="w-full"
            >
              Actualizar Estado
            </Button>
          </div>
        )}
      </BaseModal>

      {/* Modal de Formulario */}
      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={selectedAppointment?.id ? "Editar Cita" : "Nueva Cita"}
      >
        <AppointmentForm
          initialValues={selectedAppointment ?? undefined}
          isEditing={!!selectedAppointment?.id}
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
