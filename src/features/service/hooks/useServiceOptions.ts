import { useEffect, useState } from "react";
import { getServices } from "../services/serviceService";

export function useServiceOptions() {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getServices().then((services) => {
      const formatted = services
        .filter((s) => !!s.id)
        .map((service) => ({
          label: service.name,
          value: service.id.toString(),
        }));
      setOptions(formatted);
    });
  }, []);

  return options;
}
