import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from './input';
import { Label } from './label';

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
}: ControlledInputProps<T>) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              {...field}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}