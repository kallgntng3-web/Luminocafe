import { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'] & { categories: { name: string } | null };

const Menu = () => {
  const [categories, setCategories] = useState<Database['public']['Tables']['categories']['Row'][]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [catsRes, itemsRes] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*, categories(name)').eq('is_available', true).order('display_order'),
    ]);
    if (catsRes.data) setCategories(catsRes.data);
    if (itemsRes.data) setMenuItems(itemsRes.data);
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category_id === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 flex items-end justify-start overflow-hidden pt-20"
        style={{ background: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1920&q=80) center/cover no-repeat` }}
      >
        <div className="container mx-auto px-6 pb-10 animate-fade-in-up">
          <p className="section-label text-accent/70 mb-2">Lumino Cafe</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none">Our Menu</h1>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border sticky top-20 bg-background/95 backdrop-blur-lg z-10">
        <div className="container mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {[{ id: 'all', name: 'All' }, ...categories].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-body font-medium border-b-2 transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 py-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-24">
            <Coffee className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 60, 500)}ms` }}
              >
                {/* Image */}
                <div className="aspect-square rounded overflow-hidden bg-muted mb-3 relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="w-10 h-10 text-muted-foreground/25" />
                    </div>
                  )}
                  {item.categories?.name && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white/80 rounded text-[10px] font-body tracking-wide uppercase">
                        {item.categories.name}
                      </span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <h3 className="font-display font-semibold text-foreground text-base mb-1 group-hover:text-accent transition-colors duration-300">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-muted-foreground font-body text-xs line-clamp-2 mb-2">{item.description}</p>
                )}
                <p className="font-body font-bold text-accent">
                  {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
