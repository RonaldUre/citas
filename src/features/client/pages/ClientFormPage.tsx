import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema, type ClientFormInput } from '../schemas/clientSchema'
import { createClient, getClient, updateClient } from '../services/clientService'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ControlledInput } from '@/components/ui/controlled-input'
import { ControlledTextarea } from '@/components/ui/ControlledTextarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ClientFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)

  const form = useForm<ClientFormInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      getClient(Number(id))
        .then((res) => {
          form.reset(res.data)
        })
        .catch(() => {
          toast.error('No se pudo cargar el cliente')
          navigate('/clients')
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate])

  const onSubmit = async (values: ClientFormInput) => {
    try {
      if (isEditing) {
        await updateClient(Number(id), values)
        toast.success('Cliente actualizado')
      } else {
        await createClient(values)
        toast.success('Cliente creado')
      }
      navigate('/clients')
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error al guardar el cliente')
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
          ← Regresar
        </Button>
      </div>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <ControlledInput
                control={form.control}
                name="name"
                label="Nombre"
                placeholder="Juan Pérez"
              />
              <ControlledInput
                control={form.control}
                name="email"
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
              />
              <ControlledInput
                control={form.control}
                name="phone"
                label="Teléfono"
                placeholder="0412-1234567"
              />
              <ControlledTextarea
                control={form.control}
                name="notes"
                label="Notas"
                placeholder="Cliente frecuente, tiene alergia al látex..."
                rows={3}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || loading}
              >
                {form.formState.isSubmitting
                  ? isEditing
                    ? 'Actualizando...'
                    : 'Creando...'
                  : isEditing
                  ? 'Actualizar Cliente'
                  : 'Crear Cliente'}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
