/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  control: any;
  label?: string;
};

export const ControlledDateTimePicker = ({ name, control, label }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <DatePicker
              id={name}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="Selecciona fecha y hora"
              className={cn(
                "w-full px-3 py-2 border rounded-md text-sm",
                fieldState.error ? "border-red-500" : "border-gray-300"
              )}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};
