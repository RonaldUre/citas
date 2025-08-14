import { useEffect, useState } from "react";
import { getUsersByRole } from "@/features/user/services/userService";

export function useUsersOptions() {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getUsersByRole("PROFESSIONAL").then((res) => {
      const formatted = res
        .filter((user) => !!user.id)
        .map((user) => ({
          label: user.name,
          value: user.id.toString(),
        }));
      setOptions(formatted);
    });
  }, []);

  return options;
}
