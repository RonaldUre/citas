// ControlledTextarea.tsx
import * as React from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type NativeTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name" | "value" | "defaultValue" | "onChange"
>;

export interface ControlledTextareaProps<TFieldValues extends FieldValues> extends NativeTextareaProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export function ControlledTextarea<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  containerClassName,
  labelClassName,
  ...rest
}: ControlledTextareaProps<TFieldValues>) {
  const id = rest.id ?? String(name);
  return (
    <div className={containerClassName}>
      {label && <Label htmlFor={id} className={labelClassName}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            id={id}
            {...rest}
            {...field}
            aria-invalid={fieldState.invalid || undefined}
          />
        )}
      />
    </div>
  );
}
