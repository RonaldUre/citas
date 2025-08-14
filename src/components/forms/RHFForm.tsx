import { FormProvider, type FieldValues, type UseFormReturn, type SubmitHandler } from "react-hook-form";

interface RHFFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: (form: UseFormReturn<TFieldValues>) => React.ReactNode;
  className?: string;
  noValidate?: boolean;
}

export function RHFForm<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  noValidate = true,
}: RHFFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate={noValidate}
        className={className}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}
