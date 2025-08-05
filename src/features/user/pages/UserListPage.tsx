/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from "react"
import {
  getUsers,
  getUserById,
  deleteUser,
} from "../services/userService"
import type { UserResponse } from "../types/userTypes"
import { CrudTable } from "@/components/shared/CrudTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { BaseModal } from "@/components/shared/BaseModal"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/hooks/useAuth"

const PAGE_SIZE = 10

export function UserListPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null)

  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const res = await getUsers()
      setUsers(res)
    } catch (error) {
      toast.error("Error al cargar los usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/edit`)
  }

  const confirmDelete = (user: UserResponse) => {
    if (user.id === currentUser?.userId) {
      toast.warning("No puedes eliminar tu propio usuario.")
      return
    }
    setUserToDelete(user)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    try {
      await deleteUser(userToDelete.id)
      toast.success("Usuario eliminado")
      fetchUsers()
      setPage(1)
    } catch (error) {
      toast.error("No se pudo eliminar el usuario")
    } finally {
      setUserToDelete(null)
    }
  }

  const handleOpenModal = async (id: number) => {
    try {
      const user = await getUserById(id)
      setSelectedUser(user)
      setIsModalOpen(true)
    } catch (error) {
      toast.error("No se pudo cargar el detalle del usuario " + error)
    }
  }

  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase()
    return users.filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }, [searchTerm, users])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, page])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Button onClick={() => navigate("/users/new")}>+ Nuevo Usuario</Button>
        </div>
      </div>

      {/* Mobile - Cards */}
      <div className="space-y-4 md:hidden">
        {paginatedUsers.map((user) => (
          <Card key={user.id} className="p-4 space-y-2">
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="text-sm">Rol: {user.role}</div>
            <div className="pt-2 flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenModal(user.id)}
              >
                Ver detalle
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleEdit(user.id)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => confirmDelete(user)}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop - Tabla */}
      <div className="hidden md:block">
        <CrudTable<UserResponse>
          data={paginatedUsers}
          isLoading={isLoading}
          columns={[
            { header: "Nombre", render: (u) => u.name },
            { header: "Email", render: (u) => u.email },
            { header: "Rol", render: (u) => u.role },
            {
              header: "Detalle",
              render: (u) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(u.id)}
                >
                  Ver detalle
                </Button>
              ),
            },
            {
              header: "Editar",
              render: (u) => (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(u.id)}
                >
                  Editar
                </Button>
              ),
            },
            {
              header: "Eliminar",
              render: (u) => (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(u)}
                >
                  Eliminar
                </Button>
              ),
            },
          ]}
        />
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Modal de detalle */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalle del Usuario"
      >
        {selectedUser ? (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Rol:</strong> {selectedUser.role}</p>
            <p>
              <strong>Avatar:</strong>{" "}
              {selectedUser.avatar ? (
                <a
                  href={selectedUser.avatar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver imagen
                </a>
              ) : "—"}
            </p>
            <p>
              <strong>Último acceso:</strong>{" "}
              {selectedUser.lastLogin
                ? new Date(selectedUser.lastLogin).toLocaleString()
                : "—"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Cargando usuario...</p>
        )}
      </BaseModal>

      {/* Modal de confirmación de eliminación */}
      <BaseModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="¿Eliminar usuario?"
      >
        <div className="space-y-4">
          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong>{userToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setUserToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!userToDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

