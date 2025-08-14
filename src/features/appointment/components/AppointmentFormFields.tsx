import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledDateTimePicker } from "@/components/ui/ControlledDateTimePicker";
import { type UseFormReturn } from "react-hook-form";
import { type AppointmentFormInput } from "../schemas/appointmentSchema";

interface Props {
  form: UseFormReturn<AppointmentFormInput>;
  services: { label: string; value: string | number }[];
  professionals: { label: string; value: string | number }[];
  clients: { label: string; value: string | number }[];
}

export function AppointmentFormFields({
  form,
  services,
  professionals,
  clients,
}: Props) {
  return (
    <>
      <ControlledDateTimePicker
        control={form.control}
        name="date"
        label="Fecha y hora"
      />

      <ControlledSelect
        control={form.control}
        name="status"
        label="Estado"
        options={[
          { label: "Pendiente", value: "PENDING" },
          { label: "Confirmada", value: "CONFIRMED" },
          { label: "Completada", value: "COMPLETED" },
          { label: "Cancelada", value: "CANCELLED" },
        ]}
        placeholder="Selecciona estado"
      />

      <ControlledInput
        control={form.control}
        name="tag"
        label="Etiqueta (opcional)"
        placeholder="Primera consulta, sesión 2..."
      />

      <ControlledSelect
        control={form.control}
        name="userId"
        label="Profesional"
        options={professionals}
        isClearable
        valueAsNumber   // 👈 importante: IDs numéricos
        placeholder="Selecciona profesional"
      />

      <ControlledSelect
        control={form.control}
        name="clientId"
        label="Cliente"
        options={clients}
        isClearable
        valueAsNumber   // 👈 importante
        placeholder="Selecciona cliente"
      />

      <ControlledSelect
        control={form.control}
        name="serviceId"
        label="Servicio"
        options={services}
        isClearable
        valueAsNumber   // 👈 importante
        placeholder="Selecciona servicio"
      />
    </>
  );
}
