import { useEffect, useState } from "react";
import { getUsers } from "@/features/user/services/userService";

export function useUsersOptions() {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getUsers().then((res) => {
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
