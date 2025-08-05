/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { formatISO } from "date-fns"
import { AppointmentForm } from "../components/AppointmentForm"
import type { AppointmentFormInput } from "../schemas/appointmentSchema"
import { BaseModal } from "@/components/shared/BaseModal"
import { useAppointmentCalendar } from "../hooks/useAppointmentCalendar"

const AppointmentCalendarPage = () => {
  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({
    from: formatISO(new Date()),
    to: formatISO(new Date()),
  })

  const { events, refetch } = useAppointmentCalendar(dateRange.from, dateRange.to)

  const [clickedEvent, setClickedEvent] = useState<{
    title: string
    start?: Date
    end?: Date
    extendedProps: {
      client: string
      professional: string
      status: string
    }
  } | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<
    (AppointmentFormInput & { id?: number }) | null
  >(null)

  const handleNewAppointment = () => {
    setSelectedAppointment(null)
    setFormOpen(true)
  }

  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo
    setClickedEvent({
      title: event.title,
      start: event.start ?? undefined,
      end: event.end ?? undefined,
      extendedProps: {
        client: event.extendedProps.client,
        professional: event.extendedProps.professional,
        status: event.extendedProps.status,
      },
    })
  }

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
        editable={false}
        events={events}
        height="auto"
        datesSet={(info) => {
          setDateRange({
            from: formatISO(info.start),
            to: formatISO(info.end),
          })
        }}
        eventClick={handleEventClick}
        select={(info) => {
          setSelectedAppointment({
            date: info.startStr,
            status: "PENDING",
            userId: 0,
            clientId: 0,
            tag: "",
            isRecurring: false,
          })
          setFormOpen(true)
        }}
      />

      {/* Modal de Detalle */}
      <BaseModal
        isOpen={!!clickedEvent}
        onClose={() => setClickedEvent(null)}
        title="Detalle de la cita"
      >
        {clickedEvent && (
          <div className="space-y-2">
            <p>
              <strong>Cliente:</strong> {clickedEvent.extendedProps.client}
            </p>
            <p>
              <strong>Profesional:</strong> {clickedEvent.extendedProps.professional}
            </p>
            <p>
              <strong>Estado:</strong> {clickedEvent.extendedProps.status}
            </p>
            <p>
              <strong>Inicio:</strong> {clickedEvent.start?.toLocaleString() ?? "N/A"}
            </p>
            <p>
              <strong>Fin:</strong> {clickedEvent.end?.toLocaleString() ?? "N/A"}
            </p>
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
            setFormOpen(false)
            refetch()
          }}
        />
      </BaseModal>
    </div>
  )
}

export default AppointmentCalendarPage
