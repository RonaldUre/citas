// src/components/ui/controlled-select.tsx
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./select";
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "./form";
import type { Control, FieldValues, Path } from "react-hook-form";

export type Option = { label: string; value: string | number };

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  isClearable?: boolean;
  valueAsNumber?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecciona una opción",
  isClearable = false,
  valueAsNumber = false,
  containerClassName,
  labelClassName,
}: ControlledSelectProps<T>) {
  const EMPTY = "__empty__"; // 👈 sentinel NO vacío

  const finalOptions = isClearable
    ? [{ label: placeholder, value: EMPTY }, ...options]
    : options;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Select de shadcn trabaja con string (o undefined)
        const value = field.value == null ? EMPTY : String(field.value);

        const handleChange = (val: string) => {
          if (val === EMPTY) {
            field.onChange(undefined);
          } else {
            field.onChange(valueAsNumber ? Number(val) : val);
          }
        };

        return (
          <FormItem className={containerClassName}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <Select value={value} onValueChange={handleChange}>
              <FormControl>
                <SelectTrigger aria-invalid={fieldState.invalid || undefined}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {finalOptions.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
