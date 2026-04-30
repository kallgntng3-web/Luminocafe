import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Image as ImageIcon, Star, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    menuItems: 0,
    galleryPhotos: 0,
    reviews: 0,
    bookings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [menuCount, galleryCount, reviewCount, bookingCount] = await Promise.all([
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_photos').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      menuItems: menuCount.count || 0,
      galleryPhotos: galleryCount.count || 0,
      reviews: reviewCount.count || 0,
      bookings: bookingCount.count || 0,
    });
  };

  const statCards = [
    {
      title: 'Menu Items',
      value: stats.menuItems,
      icon: Coffee,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Gallery Photos',
      value: stats.galleryPhotos,
      icon: ImageIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Reviews',
      value: stats.reviews,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="/admin/menu"
                  className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
                >
                  <h3 className="font-semibold mb-2">Manage Menu</h3>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, or remove menu items
                  </p>
                </a>
                <a
                  href="/admin/bookings"
                  className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
                >
                  <h3 className="font-semibold mb-2">View Bookings</h3>
                  <p className="text-sm text-muted-foreground">
                    Check and manage table reservations
                  </p>
                </a>
                <a
                  href="/admin/promos"
                  className="p-4 border border-border rounded-lg hover:border-accent transition-colors"
                >
                  <h3 className="font-semibold mb-2">Manage Promos</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage promotional offers
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
