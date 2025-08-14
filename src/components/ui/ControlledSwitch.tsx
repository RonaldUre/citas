import { Controller, useFormContext } from "react-hook-form"
import { Switch } from "@/components/ui/switch"

type ControlledSwitchProps = {
  name: string
  label?: string
  description?: string
}

export function ControlledSwitch({ name, label, description }: ControlledSwitchProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Switch
            id={name}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
          <div className="grid gap-0.5">
            {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
    />
  )
}
