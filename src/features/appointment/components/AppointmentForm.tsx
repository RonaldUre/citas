import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  type AppointmentFormInput,
} from "../schemas/appointmentSchema";
import { appointmentService } from "../service/appointmentService";
import { useEffect, useState } from "react";
import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ControlledDateTimePicker } from "@/components/ui/ControlledDateTimePicker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useClientsOptions } from "@/features/client/hooks/useClientsOptions";
import { useUsersOptions } from "@/features/user/hooks/useUsersOptions";
import { useServiceOptions } from "@/features/service/hooks/useServiceOptions";

export interface AppointmentFormProps {
  id?: number;
  initialValues?: AppointmentFormInput;
  onSuccess?: () => void;
  isEditing?: boolean;
  loading?: boolean; // ✅ Agregado para evitar el error
}

export function AppointmentForm({
  id,
  initialValues,
  onSuccess,
  isEditing = false,
  loading: externalLoading = false,
}: AppointmentFormProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;

  const clients = useClientsOptions();
  const professionals = useUsersOptions();
  const services = useServiceOptions();

  const form = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialValues ?? {
      date: "",
      status: "PENDING",
      userId: undefined,
      clientId: undefined,
      serviceId: undefined,
      tag: "",
      isRecurring: false,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (values: AppointmentFormInput) => {
    setInternalLoading(true);
    try {
      if (isEditing && id) {
        await appointmentService.update(id, values);
        toast.success("Cita actualizada");
      } else {
        await appointmentService.create(values);
        toast.success("Cita creada");
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar la cita");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
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
        />
        <ControlledSelect
          control={form.control}
          name="clientId"
          label="Cliente"
          options={clients}
        />
        <ControlledSelect
          control={form.control}
          name="serviceId"
          label="Servicio"
          options={services}
          isClearable
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || loading}
        >
          {form.formState.isSubmitting || loading
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
            ? "Actualizar Cita"
            : "Crear Cita"}
        </Button>
      </form>
    </FormProvider>
  );
}
