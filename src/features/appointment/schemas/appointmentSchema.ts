import { z } from "zod";

// ✅ Enum exacto del backend
export const appointmentStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

// ✅ Esquema completo del formulario
export const appointmentSchema = z.object({
  date: z
    .string({ error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria"),
  status: appointmentStatusEnum,
  tag: z.string().optional(),
  isRecurring: z.boolean().optional(),
  userId: z
    .number({ error: "El profesional es obligatorio" })
    .min(1, "Selecciona un profesional"),
  clientId: z
    .number({ error: "El cliente es obligatorio" })
    .min(1, "Selecciona un cliente"),
  serviceId: z.number().min(1).optional(),
});

// ✅ Tipo inferido para el formulario
export type AppointmentFormInput = z.infer<typeof appointmentSchema>;
