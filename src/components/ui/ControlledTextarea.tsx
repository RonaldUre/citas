import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface ControlledTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  rows?: number
}

export function ControlledTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
}: ControlledTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label htmlFor={name}>{label}</Label>
          <FormControl>
            <Textarea id={name} placeholder={placeholder} rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
