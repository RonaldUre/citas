import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientFormInput } from "../schemas/clientSchema";
import { createClient, getClient, updateClient } from "../services/clientService";

// Layout & forms reutilizables
import { PageHeader } from "@/components/layout/PageHeader";
import { EntityFormCard } from "@/components/layout/EntityFormCard";
import { RHFForm } from "@/components/forms/RHFForm";
import { SubmitButton } from "@/components/forms/SubmitButton";

// Campos específicos del feature
import { ClientFormFields } from "../components/ClientFormFields";

// Hook genérico
import { useEntityForm } from "@/hooks/useEntityForm";

export default function ClientFormPage() {
  const { form, isEditing, loading, onSubmit } = useEntityForm<ClientFormInput, ClientFormInput>({
    defaultValues: { name: "", email: "", phone: "", notes: "" },
    resolver: zodResolver(clientSchema),
    listRoute: "/clients",
    fetchById: async (id) => (await getClient(id)).data,
    createFn: (payload) => createClient(payload),
    updateFn: (id, payload) => updateClient(id, payload),
  });

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-6">
      <PageHeader
        title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        backTo="/clients"
      />

      <EntityFormCard title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}>
        {loading ? (
          <div className="h-32 animate-pulse rounded-md bg-muted" />
        ) : (
          <RHFForm form={form} onSubmit={onSubmit} className="space-y-4">
            {(f) => (
              <>
                <ClientFormFields form={f} />

                <SubmitButton
                  className="w-full"
                  isSubmitting={f.formState.isSubmitting}
                  isEditing={isEditing}
                  // Evita submits vacíos en "crear"
                  disabled={!isEditing && !f.formState.isDirty}
                />
              </>
            )}
          </RHFForm>
        )}
      </EntityFormCard>
    </div>
  );
}
