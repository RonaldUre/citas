// features/appointment/types/appointmentFormTypes.ts
import type {
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "./appointmentTypes";

// Form-friendly (permite undefined en selects)
export type AppointmentFormInput = {
  date: string;
  status: AppointmentStatus;
  tag?: string;
  isRecurring?: boolean;
  userId?: number;
  clientId?: number;
  serviceId?: number;
};

// Helpers para mapear del form → DTO
export function toCreateAppointmentDTO(
  form: AppointmentFormInput
): CreateAppointmentDTO {
  if (!form.userId) throw new Error("El profesional es obligatorio");
  if (!form.clientId) throw new Error("El cliente es obligatorio");

  return {
    date: form.date,
    status: form.status,
    tag: form.tag ?? undefined,
    isRecurring: form.isRecurring ?? false,
    userId: form.userId,
    clientId: form.clientId,
    serviceId: form.serviceId ?? undefined,
  };
}

export function toUpdateAppointmentDTO(
  form: AppointmentFormInput
): UpdateAppointmentDTO {
  const dto: UpdateAppointmentDTO = {
    date: form.date,
    status: form.status,
    tag: form.tag,
    isRecurring: form.isRecurring,
    serviceId: form.serviceId,
  };
  if (form.userId != null) dto.userId = form.userId;
  if (form.clientId != null) dto.clientId = form.clientId;
  return dto;
}
