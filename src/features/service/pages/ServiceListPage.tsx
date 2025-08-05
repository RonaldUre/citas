/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo } from "react"
import {
  getServices,
  deleteService,
  getServiceById,
} from "../services/serviceService"
import type { ServiceResponse } from "../types/serviceTypes"
import { CrudTable } from "@/components/shared/CrudTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { BaseModal } from "@/components/shared/BaseModal"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

const PAGE_SIZE = 10

export function ServiceListPage() {
  const [services, setServices] = useState<ServiceResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<ServiceResponse | null>(null)

  const navigate = useNavigate()

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const res = await getServices()
      setServices(res)
    } catch (error) {
      toast.error("Error al cargar los servicios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/services/${id}/edit`)
  }

  const confirmDelete = (service: ServiceResponse) => {
    setServiceToDelete(service)
  }

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return
    try {
      await deleteService(serviceToDelete.id)
      toast.success("Servicio eliminado")
      fetchServices()
      setPage(1)
    } catch (error) {
      toast.error("No se pudo eliminar el servicio")
    } finally {
      setServiceToDelete(null)
    }
  }

  const handleOpenModal = async (id: number) => {
    try {
      const service = await getServiceById(id)
      setSelectedService(service)
      setIsModalOpen(true)
    } catch (error) {
      toast.error("No se pudo cargar el detalle del servicio")
    }
  }

  const filteredServices = useMemo(() => {
    const query = searchTerm.toLowerCase()
    return services.filter((s) =>
      s.name.toLowerCase().includes(query)
    )
  }, [searchTerm, services])

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredServices.slice(start, start + PAGE_SIZE)
  }, [filteredServices, page])

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Servicios</h1>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Button onClick={() => navigate("/services/new")}>+ Nuevo Servicio</Button>
        </div>
      </div>

      {/* Mobile - Cards */}
      <div className="space-y-4 md:hidden">
        {paginatedServices.map((service) => (
          <Card key={service.id} className="p-4 space-y-2">
            <div className="font-semibold text-lg">{service.name}</div>
            <div className="text-sm text-muted-foreground">
              {service.description || "Sin descripción"}
            </div>
            <div className="text-sm">Duración: {service.duration} min</div>
            <div className="text-sm">
              Precio: {service.price != null ? `$${service.price}` : "—"}
            </div>
            <div className="pt-2 flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => handleOpenModal(service.id)}>
                Ver detalle
              </Button>
              <Button size="sm" variant="warning" onClick={() => handleEdit(service.id)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => confirmDelete(service)}>
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop - Tabla */}
      <div className="hidden md:block">
        <CrudTable<ServiceResponse>
          data={paginatedServices}
          isLoading={isLoading}
          columns={[
            { header: "Nombre", render: (s) => s.name },
            { header: "Descripción", render: (s) => s.description || "—" },
            { header: "Duración", render: (s) => `${s.duration} min` },
            { header: "Precio", render: (s) => s.price != null ? `$${s.price}` : "—" },
            {
              header: "Detalle",
              render: (s) => (
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(s.id)}>
                  Ver detalle
                </Button>
              ),
            },
            {
              header: "Editar",
              render: (s) => (
                <Button variant="warning" size="sm" onClick={() => handleEdit(s.id)}>
                  Editar
                </Button>
              ),
            },
            {
              header: "Eliminar",
              render: (s) => (
                <Button variant="destructive" size="sm" onClick={() => confirmDelete(s)}>
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
        title="Detalle del Servicio"
      >
        {selectedService ? (
          <div className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {selectedService.name}</p>
            <p><strong>Descripción:</strong> {selectedService.description || "—"}</p>
            <p><strong>Duración:</strong> {selectedService.duration} minutos</p>
            <p><strong>Precio:</strong> {selectedService.price != null ? `$${selectedService.price}` : "—"}</p>
            <p><strong>Creado el:</strong> {new Date(selectedService.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Cargando servicio...</p>
        )}
      </BaseModal>

      {/* Modal de confirmación de eliminación */}
      <BaseModal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        title="¿Eliminar servicio?"
      >
        <div className="space-y-4">
          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar el servicio{" "}
            <strong>{serviceToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setServiceToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!serviceToDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}
