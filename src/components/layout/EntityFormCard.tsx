import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EntityFormCardProps {
  title: string;
  children: React.ReactNode;
}

export function EntityFormCard({ title, children }: EntityFormCardProps) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
