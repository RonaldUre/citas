// components/shared/MobileEntityCard.tsx
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface MobileEntityCardProps {
  title: string;
  subtitle?: string;
  extra?: string;
  children?: ReactNode; // texto adicional
  actions: ReactNode; // botones personalizados
}

export function MobileEntityCard({
  title,
  subtitle,
  extra,
  children,
  actions,
}: MobileEntityCardProps) {
  return (
    <Card className="p-4 space-y-2">
      <div className="font-semibold text-lg">{title}</div>
      {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      {extra && <div className="text-sm text-muted-foreground">{extra}</div>}
      {children}
      <div className="pt-2 flex gap-2 flex-wrap">{actions}</div>
    </Card>
  );
}
