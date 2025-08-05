import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import type { Control, FieldValues, Path } from "react-hook-form";

type Option = {
  label: string;
  value: string; // siempre string
};

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Option[];
  placeholder?: string;
  isClearable?: boolean;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecciona una opción",
  isClearable = false,
}: ControlledSelectProps<T>) {
  const finalOptions = isClearable
    ? [{ label: placeholder, value: "__empty__" }, ...options]
    : options;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value?.toString() ?? ""}
            onValueChange={(val) => {
              if (val === "__empty__") {
                field.onChange(undefined);
              } else if (!isNaN(Number(val)) && options.every((o) => !isNaN(Number(o.value)))) {
                // si todos los options son numéricos, convertimos
                field.onChange(Number(val));
              } else {
                // si son strings (como enums), lo dejamos así
                field.onChange(val);
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {finalOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
