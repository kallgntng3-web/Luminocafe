import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Coffee,
  FolderTree,
  Image as ImageIcon,
  Star,
  Tag,
  Calendar,
  Sparkles,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/menu', label: 'Menu', icon: Coffee },
  { path: '/admin/categories', label: 'Kategori', icon: FolderTree },
  { path: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/promos', label: 'Promo', icon: Tag },
  { path: '/admin/bookings', label: 'Booking', icon: Calendar },
  { path: '/admin/messages', label: 'Pesan', icon: MessageSquare },
  { path: '/admin/hero', label: 'Hero', icon: Sparkles },
  { path: '/admin/aycd', label: 'AYCD', icon: Tag },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

// Show in bottom nav (max 5 items)
const bottomNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/menu', label: 'Menu', icon: Coffee },
  { path: '/admin/messages', label: 'Pesan', icon: MessageSquare },
  { path: '/admin/bookings', label: 'Booking', icon: Calendar },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase
      .from('customer_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unread')
      .then(({ count }) => setUnreadCount(count || 0));
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Error signing out');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // Get current page label
  const currentPage = menuItems.find((m) =>
    m.path === '/admin' ? location.pathname === m.path : location.pathname.startsWith(m.path)
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── DESKTOP SIDEBAR (hidden on mobile) ─── */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">Lumino Cafe</h1>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.path === '/admin/messages' && unreadCount > 0 && (
                  <span className="ml-auto text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full justify-start text-sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
              <h2 className="text-sm font-semibold leading-none">{currentPage?.label || 'Admin'}</h2>
            </div>
          </div>
          <span className="text-sm font-bold text-primary">Lumino</span>
        </header>

        {/* Mobile Drawer Overlay */}
        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h1 className="text-lg font-bold">Lumino Cafe</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.path === '/admin/messages' && unreadCount > 0 && (
                      <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                    {active && <ChevronRight className="h-4 w-4 opacity-70" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border pb-safe">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => { handleSignOut(); setDrawerOpen(false); }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 pb-24 md:pb-8">{children}</div>
        </main>

        {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition-all ${
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-lg transition-colors ${active ? 'bg-primary/10' : ''}`}>
                    <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                    {item.path === '/admin/messages' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-primary' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
