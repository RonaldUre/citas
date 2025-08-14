import { useEffect, useState, useCallback } from "react";
import {
  getClients,
  deleteClient,
  getClient,
  type Client,
} from "../services/clientService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@/components/ui/pagination";
import { ClientHistoryModal } from "@/features/client/components/ClientHistoryModal";
import { ClientMobileList } from "@/features/client/components/ClientMobileList";
import { ClientTable } from "@/features/client/components/ClientTable";
import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { DetailModal } from "@/components/shared/DetailModal";

export function ClientListPage() {
  // ----------------------------
  // Estados
  // ----------------------------
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const navigate = useNavigate();

  // ----------------------------
  // Funciones
  // ----------------------------
  const fetchClients = useCallback(async () => {
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
  }, [page]);

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
      await fetchClients();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el cliente");
    } finally {
      setClientToDelete(null);
    }
  };

  const openHistoryModal = (client: Client) => {
    setSelectedClientForHistory({ id: client.id, name: client.name });
  };

  // ----------------------------
  // Efectos
  // ----------------------------
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <Button onClick={() => navigate("/clients/new")}>+ Nuevo Cliente</Button>
      </div>

      <ClientMobileList
        clients={clients}
        onDetail={handleOpenModal}
        onHistory={openHistoryModal}
        onEdit={handleEdit}
        onDelete={setClientToDelete}
      />

      <ClientTable
        clients={clients}
        isLoading={isLoading}
        onDetail={handleOpenModal}
        onHistory={openHistoryModal}
        onEdit={handleEdit}
        onDelete={setClientToDelete}
      />

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* -------------------- */}
      {/* Modales agrupados */} 
      {/* -------------------- */}
      <>
        <DetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Detalle del Cliente"
          loading={!selectedClient}
          fields={[
            { label: "Nombre", value: selectedClient?.name },
            { label: "Email", value: selectedClient?.email },
            { label: "Teléfono", value: selectedClient?.phone },
            { label: "Notas", value: selectedClient?.notes },
          ]}
        />

        <ConfirmDeleteModal
          isOpen={!!clientToDelete}
          title="¿Eliminar cliente?"
          description="¿Estás seguro de que deseas eliminar al cliente?"
          entityName={clientToDelete?.name}
          onCancel={() => setClientToDelete(null)}
          onConfirm={confirmDelete}
          disabled={!clientToDelete}
        />

        {selectedClientForHistory && (
          <ClientHistoryModal
            isOpen={!!selectedClientForHistory}
            onClose={() => setSelectedClientForHistory(null)}
            clientId={selectedClientForHistory.id}
            clientName={selectedClientForHistory.name}
          />
        )}
      </>
    </div>
  );
}
