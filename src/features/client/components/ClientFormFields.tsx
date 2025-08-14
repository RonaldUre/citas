import { ControlledInput } from "@/components/ui/controlled-input";
import { ControlledTextarea } from "@/components/ui/ControlledTextarea";
import { type UseFormReturn } from "react-hook-form";
import { type ClientFormInput } from "../schemas/clientSchema";

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormInput>;
}

export function ClientFormFields({ form }: ClientFormFieldsProps) {
  return (
    <>
      <ControlledInput
        name="name"
        control={form.control}
        label="Nombre"
        placeholder="Juan Pérez"
      />
      <ControlledInput
        name="email"
        control={form.control}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="correo@ejemplo.com"
      />
      <ControlledInput
        name="phone"
        control={form.control}
        label="Teléfono"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0412-1234567"
      />
      <ControlledTextarea
        name="notes"
        control={form.control}
        label="Notas"
        rows={3}
        placeholder="Cliente frecuente, tiene alergia al látex..."
      />
    </>
  );
}
