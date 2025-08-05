// src/features/dashboard/pages/DashboardPage.tsx
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          ¡Bienvenido, {user?.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Rol: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      <Button variant="outline" onClick={logout}>
        Cerrar sesión
      </Button>
    </div>
  );
}