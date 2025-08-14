import { CrudTable } from "@/components/shared/CrudTable";
import { Button } from "@/components/ui/button";
import type { Client } from "../services/clientService";

interface Props {
  clients: Client[];
  isLoading: boolean;
  onDetail: (id: number) => void;
  onHistory: (client: Client) => void;
  onEdit: (id: number) => void;
  onDelete: (client: Client) => void;
}

export function ClientTable({
  clients,
  isLoading,
  onDetail,
  onHistory,
  onEdit,
  onDelete,
}: Props) {
  const columns = [
    {
      header: "Nombre",
      render: (client: Client) => client.name,
    },
    {
      header: "Email",
      render: (client: Client) => client.email || "—",
    },
    {
      header: "Teléfono",
      render: (client: Client) => client.phone || "—",
    },
    {
      header: "Detalle",
      render: (client: Client) => (
        <Button variant="outline" size="sm" onClick={() => onDetail(client.id)}>
          Ver detalle
        </Button>
      ),
    },
    {
      header: "Historial",
      render: (client: Client) => (
        <Button variant="info" size="sm" onClick={() => onHistory(client)}>
          Historial
        </Button>
      ),
    },
    {
      header: "Editar",
      render: (client: Client) => (
        <Button variant="warning" size="sm" onClick={() => onEdit(client.id)}>
          Editar
        </Button>
      ),
    },
    {
      header: "Eliminar",
      render: (client: Client) => (
        <Button variant="destructive" size="sm" onClick={() => onDelete(client)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="hidden md:block">
      <CrudTable<Client> data={clients} isLoading={isLoading} columns={columns} />
    </div>
  );
}
