import { MobileEntityCard } from "@/components/shared/MobileEntityCard";
import { Button } from "@/components/ui/button";
import type { Client } from "../services/clientService";

interface Props {
  clients: Client[];
  onDetail: (id: number) => void;
  onHistory: (client: Client) => void;
  onEdit: (id: number) => void;
  onDelete: (client: Client) => void;
}

export function ClientMobileList({
  clients,
  onDetail,
  onHistory,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4 md:hidden">
      {clients.map((client) => (
        <MobileEntityCard
          key={client.id}
          title={client.name}
          subtitle={client.email}
          extra={client.phone}
          actions={
            <>
              <Button size="sm" variant="outline" onClick={() => onDetail(client.id)}>
                Ver detalle
              </Button>
              <Button size="sm" variant="info" onClick={() => onHistory(client)}>
                Historial
              </Button>
              <Button size="sm" variant="warning" onClick={() => onEdit(client.id)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(client)}>
                Eliminar
              </Button>
            </>
          }
        />
      ))}
    </div>
  );
}
