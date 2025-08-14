/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { RHFForm } from "@/components/forms/RHFForm";
import { SubmitButton } from "@/components/forms/SubmitButton";

import {
  appointmentSchema,
  type AppointmentFormInput,
} from "../schemas/appointmentSchema";
import { appointmentService } from "../service/appointmentService";

import { useClientsOptions } from "@/features/client/hooks/useClientsOptions";
import { useUsersOptions } from "@/features/user/hooks/useUsersOptions";
import { useServiceOptions } from "@/features/service/hooks/useServiceOptions";
import { AppointmentFormFields } from "./AppointmentFormFields";

export interface AppointmentFormProps {
  id?: number;
  initialValues?: AppointmentFormInput;
  onSuccess?: () => void;
  isEditing?: boolean;
  loading?: boolean; // loading externo (cuando el contenedor está cargando initialValues)
}

// Helpers: mapean del formulario (con ids opcionales) → DTOs estrictos del service
function toCreateDTO(v: AppointmentFormInput) {
  if (!v.userId) throw new Error("Selecciona un profesional");
  if (!v.clientId) throw new Error("Selecciona un cliente");
  return {
    date: v.date,
    status: v.status,
    tag: v.tag ?? undefined,
    isRecurring: v.isRecurring ?? false,
    userId: v.userId,
    clientId: v.clientId,
    serviceId: v.serviceId ?? undefined,
  };
}

function toUpdateDTO(v: AppointmentFormInput) {
  const out: Record<string, unknown> = {
    date: v.date,
    status: v.status,
    tag: v.tag,
    isRecurring: v.isRecurring,
    serviceId: v.serviceId,
  };
  if (v.userId != null) out.userId = v.userId;
  if (v.clientId != null) out.clientId = v.clientId;
  return out; // Partial<CreateAppointmentDTO>
}

export function AppointmentForm({
  id,
  initialValues,
  onSuccess,
  isEditing = false,
  loading: externalLoading = false,
}: AppointmentFormProps) {
  // loading interno para submit
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;

  // opciones (idealmente con TanStack Query detrás)
  const clients = useClientsOptions();        // [{label, value:number}]
  const professionals = useUsersOptions();    // [{label, value:number}]
  const services = useServiceOptions();       // [{label, value:number}]

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

  // Si cambian los initialValues (abriste modal en modo editar), resetea el form
  useEffect(() => {
    if (initialValues) form.reset(initialValues);
  }, [initialValues, form]);

  const onSubmit = async (values: AppointmentFormInput) => {
    setInternalLoading(true);
    try {
      if (isEditing && id) {
        // Update: acepta partial, sólo mandamos lo que haya
        const dto = toUpdateDTO(values);
        await appointmentService.update(id, dto as any);
        toast.success("Cita actualizada");
      } else {
        // Create: requiere userId y clientId definidos
        // Si faltan, marcamos el error en UI y abortamos
        if (!values.userId) {
          form.setError("userId", { message: "Selecciona un profesional" });
          throw new Error("Selecciona un profesional");
        }
        if (!values.clientId) {
          form.setError("clientId", { message: "Selecciona un cliente" });
          throw new Error("Selecciona un cliente");
        }
        const dto = toCreateDTO(values);
        await appointmentService.create(dto as any);
        toast.success("Cita creada");
      }
      onSuccess?.();
    } catch (error) {
      // Si fue un throw de nuestros helpers, no hace falta log detallado
      console.error(error);
      toast.error("Ocurrió un error al guardar la cita");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <RHFForm form={form} onSubmit={onSubmit} className="space-y-4">
      {(f) => (
        <>
          <AppointmentFormFields
            form={f}
            services={services}
            professionals={professionals}
            clients={clients}
          />

          <SubmitButton
            className="w-full"
            isSubmitting={f.formState.isSubmitting || loading}
            isEditing={isEditing}
            // evita submit vacío en crear
            disabled={!isEditing && !f.formState.isDirty}
          />
        </>
      )}
    </RHFForm>
  );
}
