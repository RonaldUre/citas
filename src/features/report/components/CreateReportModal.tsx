/* eslint-disable @typescript-eslint/no-explicit-any */
// features/report/components/CreateReportModal.tsx
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  createReportSchema,
  type CreateReportFormValues,
} from "../schemas/reportSchema";
import {
  createReport,
  existsReportsByAppointmentIds,
} from "../services/ReportService";

// Componentes controlados (rutas correctas)
import { ControlledTextarea } from "@/components/ui/ControlledTextarea";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";

type AppointmentSummary = {
  client?: string;
  professional?: string;
  service?: string;
  date?: string; // ISO
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  onCreated?: () => void;
  appointmentSummary?: AppointmentSummary;
};

export function CreateReportModal({
  isOpen,
  onClose,
  appointmentId,
  onCreated,
  appointmentSummary,
}: Props) {
  const methods = useForm<CreateReportFormValues>({
    resolver: zodResolver<CreateReportFormValues, any, CreateReportFormValues>(
      createReportSchema
    ),
    defaultValues: {
      description: "",
      isForEventCancel: false,
      hasRecovery: false,
      appointmentId,
    },
    mode: "onSubmit",
  });

  const {
    control, // 👈 extraemos control
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    if (!isOpen) return;
    reset({
      description: "",
      isForEventCancel: false,
      hasRecovery: false,
      appointmentId,
    });
    setValue("appointmentId", appointmentId);
  }, [isOpen, appointmentId, reset, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const existsMap = await existsReportsByAppointmentIds([
        values.appointmentId,
      ]);
      if (existsMap?.[values.appointmentId]) {
        toast.warning("Esta cita ya tiene un reporte.");
        onClose();
        return;
      }

      await createReport(values);
      toast.success("Reporte creado correctamente");
      onClose();
      onCreated?.();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "No se pudo crear el reporte"
      );
    }
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear reporte"
      description="Completa la información del reporte para la cita seleccionada."
    >
      {appointmentSummary && (
        <div className="mb-4 rounded-lg border p-3 text-sm">
          <div className="grid gap-1">
            <p>
              <strong>Cliente:</strong> {appointmentSummary.client ?? "—"}
            </p>
            <p>
              <strong>Profesional:</strong>{" "}
              {appointmentSummary.professional ?? "—"}
            </p>
            <p>
              <strong>Servicio:</strong> {appointmentSummary.service ?? "—"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {appointmentSummary.date
                ? new Date(appointmentSummary.date).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input type="hidden" value={appointmentId} readOnly />

          <ControlledTextarea<CreateReportFormValues>
            name="description"
            control={control}
            label="Descripción"
            placeholder="Describe lo ocurrido..."
            rows={5}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <ControlledSwitch
              name="isForEventCancel"
              label="¿Deriva de cancelación del evento?"
            />
            <ControlledSwitch
              name="hasRecovery"
              label="¿Tiene recuperación/seguimiento?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear reporte"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
}
