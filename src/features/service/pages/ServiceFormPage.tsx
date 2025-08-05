/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createServiceSchema,
  updateServiceSchema,
} from "../schemas/serviceSchema"
import {
  createService,
  getServiceById,
  updateService,
} from "../services/serviceService"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ControlledInput } from "@/components/ui/controlled-input"
import { ControlledTextarea } from "@/components/ui/ControlledTextarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ServiceFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(isEditing ? updateServiceSchema : createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: undefined,
    },
  })

  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      getServiceById(Number(id))
        .then((data) => {
          form.reset({
            name: data.name,
            description: data.description || "",
            duration: data.duration,
            price: data.price,
          })
        })
        .catch(() => {
          toast.error("No se pudo cargar el servicio")
          navigate("/services")
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate])

  const onSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateService(Number(id), values)
        toast.success("Servicio actualizado")
      } else {
        await createService(values)
        toast.success("Servicio creado")
      }
      navigate("/services")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Ocurrió un error al guardar el servicio")
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl">
        <Button variant="outline" size="sm" onClick={() => navigate("/services")}>
          ← Regresar
        </Button>
      </div>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
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
                label="Nombre del servicio"
                placeholder="Masaje relajante"
              />

              <ControlledTextarea
                control={form.control}
                name="description"
                label="Descripción"
                placeholder="Descripción opcional del servicio"
              />

              <ControlledInput
                control={form.control}
                name="duration"
                label="Duración (minutos)"
                type="number"
                placeholder="Ej: 60"
              />

              <ControlledInput
                control={form.control}
                name="price"
                label="Precio ($)"
                type="number"
                placeholder="Ej: 50"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || loading}
              >
                {form.formState.isSubmitting
                  ? isEditing
                    ? "Actualizando..."
                    : "Creando..."
                  : isEditing
                  ? "Actualizar Servicio"
                  : "Crear Servicio"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
