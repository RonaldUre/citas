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

  // 👇 Ahora pueden ser undefined
  userId: z.number().optional(),
  clientId: z.number().optional(),

  serviceId: z.number().optional(),
});

// ✅ Tipo inferido para el formulario
export type AppointmentFormInput = z.infer<typeof appointmentSchema>;
