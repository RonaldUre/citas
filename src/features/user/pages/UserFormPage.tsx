/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
  roles,
} from "../schemas/userSchema"
import {
  createUser,
  getUserById,
  updateUser,
} from "../services/userService"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ControlledInput } from "@/components/ui/controlled-input"
import { ControlledSelect } from "@/components/ui/controlled-select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function UserFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PROFESSIONAL",
      avatar: "",
    },
  })

  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      getUserById(Number(id))
        .then((data) => {
          form.reset({
            ...data,
            password: "", // No mostramos la contraseña existente
          })
        })
        .catch(() => {
          toast.error("No se pudo cargar el usuario")
          navigate("/users")
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, form, navigate])

  const onSubmit = async (values: CreateUserFormValues | UpdateUserFormValues) => {
    try {
      if (isEditing) {
        await updateUser(Number(id), values)
        toast.success("Usuario actualizado")
      } else {
        await createUser(values as CreateUserFormValues)
        toast.success("Usuario creado")
      }
      navigate("/users")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Ocurrió un error al guardar el usuario")
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl">
        <Button variant="outline" size="sm" onClick={() => navigate("/users")}>
          ← Regresar
        </Button>
      </div>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
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
                placeholder="María Fernández"
              />

              <ControlledInput
                control={form.control}
                name="email"
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                type="email"
              />

              <ControlledInput
                control={form.control}
                name="password"
                label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                placeholder="••••••"
                type="password"
              />

              <ControlledSelect
                control={form.control}
                name="role"
                label="Rol"
                options={roles.map((r) => ({ label: r, value: r }))}
              />

              <ControlledInput
                control={form.control}
                name="avatar"
                label="Avatar (URL)"
                placeholder="https://imagen.com/avatar.jpg"
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
                  ? "Actualizar Usuario"
                  : "Crear Usuario"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
