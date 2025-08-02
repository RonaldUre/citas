// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Calendar,
  FileText,
  LogOut,
  Scissors,
  X,
} from 'lucide-react';

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Clientes', path: '/clientes', icon: <Users className="w-5 h-5" /> },
  { label: 'Citas', path: '/citas', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Servicios', path: '/servicios', icon: <Scissors className="w-5 h-5" /> },
  { label: 'Reportes', path: '/reportes', icon: <FileText className="w-5 h-5" /> },
];

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`${
        isMobile ? 'w-full' : 'w-64'
      } h-screen bg-background border-r flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <span className="text-lg font-bold tracking-tight text-primary">
          Gestión de Citas
        </span>
        {!isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`
              }
            >
              <span className="text-muted-foreground">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        <div className="mb-2">
          <div className="font-medium text-foreground">{user?.email}</div>
          <div className="uppercase text-[10px] text-blue-600 font-semibold tracking-wide">
            {user?.role}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2 text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}