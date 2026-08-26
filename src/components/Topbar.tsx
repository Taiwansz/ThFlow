import { Search, UserCircle, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar caçambas, clientes, obras..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <button className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-secondary/80">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </button>
          <button className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-secondary/80">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
}
