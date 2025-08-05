/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  getClients,
  deleteClient,
  getClient,
  type Client,
} from "../services/clientService";
import { CrudTable } from "@/components/shared/CrudTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@/components/ui/pagination";
import { BaseModal } from "@/components/shared/BaseModal";

export function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await getClients(page);
      setClients(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      toast.success("Cliente eliminado");
      fetchClients();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el cliente");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/clients/${id}/edit`);
  };

  const handleOpenModal = async (id: number) => {
    try {
      const res = await getClient(id);
      setSelectedClient(res.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("No se pudo cargar el detalle del cliente" + error);
    }
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete.id);
      toast.success("Cliente eliminado");
      fetchClients();
    } catch (error) {
      toast.error("No se pudo eliminar el cliente");
    } finally {
      setClientToDelete(null);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <Button onClick={() => navigate("/clients/new")}>
          + Nuevo Cliente
        </Button>
      </div>

      {/* Versión mobile con cards */}
      <div className="space-y-4 md:hidden">
        {clients.map((client) => (
          <Card key={client.id} className="p-4 space-y-2">
            <div className="font-semibold text-lg">{client.name}</div>
            {client.email && (
              <div className="text-sm text-muted-foreground">
                {client.email}
              </div>
            )}
            {client.phone && (
              <div className="text-sm text-muted-foreground">
                {client.phone}
              </div>
            )}
            <div className="pt-2 flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenModal(client.id)}
              >
                Ver detalle
              </Button>
              <Button
                size="sm"
                variant="info"
                onClick={() => toast.info("Historial disponible pronto")}
              >
                Historial
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleEdit(client.id)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setClientToDelete(client)}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Versión desktop con tabla */}
      <div className="hidden md:block">
        <CrudTable<Client>
          data={clients}
          isLoading={isLoading}
          columns={[
            {
              header: "Nombre",
              render: (client) => client.name,
            },
            {
              header: "Email",
              render: (client) => client.email || "—",
            },
            {
              header: "Teléfono",
              render: (client) => client.phone || "—",
            },
            {
              header: "Detalle",
              render: (client) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(client.id)}
                >
                  Ver detalle
                </Button>
              ),
            },
            {
              header: "Historial",
              render: (client) => (
                <Button
                  variant="info"
                  size="sm"
                  onClick={() =>
                    toast.warning(
                      "Historial disponible pronto para " + client.name
                    )
                  }
                >
                  Historial
                </Button>
              ),
            },
            {
              header: "Editar",
              render: (client) => (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(client.id)}
                >
                  Editar
                </Button>
              ),
            },
            {
              header: "Eliminar",
              render: (client) => (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setClientToDelete(client)}
                >
                  Eliminar
                </Button>
              ),
            },
          ]}
        />
      </div>

      {/* Paginación global visible para ambas vistas */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modal de detalle */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalle del Cliente"
      >
        {selectedClient ? (
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {selectedClient.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedClient.email || "—"}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedClient.phone || "—"}
            </p>
            <p>
              <strong>Notas:</strong> {selectedClient.notes || "—"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Cargando cliente...</p>
        )}
      </BaseModal>

      <BaseModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        title="¿Eliminar cliente?"
      >
        <div className="space-y-4">
          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar al cliente{" "}
            <strong>{clientToDelete?.name}</strong>? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setClientToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!clientToDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
