// src/components/layout/PrivateLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function PrivateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar colapsable en escritorio */}
      {sidebarOpen && (
        <div className="hidden md:block">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Botón para abrir sidebar en escritorio */}
      {!sidebarOpen && (
        <div className="fixed top-4 left-4 z-50 md:block hidden">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Mobile menu con Sheet */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full max-w-xs">
            <Sidebar isMobile />
          </SheetContent>
        </Sheet>
      </div>

      {/* Contenido principal */}
      <main className={`flex-1 ${!sidebarOpen ? ' ml-0' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}