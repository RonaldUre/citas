// ControlledInput.tsx
import * as React from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input"; // shadcn input
import { Label } from "@/components/ui/label";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "defaultValue" | "onChange"
>;

export interface ControlledInputProps<TFieldValues extends FieldValues> extends NativeInputProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export function ControlledInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  containerClassName,
  labelClassName,
  ...rest // ← aquí vienen autoComplete, inputMode, type, placeholder, etc.
}: ControlledInputProps<TFieldValues>) {
  const id = rest.id ?? String(name);
  return (
    <div className={containerClassName}>
      {label && <Label htmlFor={id} className={labelClassName}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            id={id}
            {...rest}
            {...field}
            aria-invalid={fieldState.invalid || undefined}
          />
        )}
      />
      {/** si tienes componente de error, muéstralo aquí */}
    </div>
  );
}
