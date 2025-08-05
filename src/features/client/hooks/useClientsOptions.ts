import { useEffect, useState } from "react";
import { getAllClients } from "../services/clientService";

export function useClientsOptions() {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getAllClients().then((res) => {
      const formatted = res.data
        .filter((client) => !!client.id) // 💡 filtrar sin id válido
        .map((client) => ({
          label: client.name,
          value: client.id.toString(),
        }));
      setOptions(formatted);
    });
  }, []);

  return options;
}
