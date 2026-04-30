import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Tag } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

const Promo = () => {
  const [promos, setPromos] = useState<Database['public']['Tables']['promos']['Row'][]>([]);

  useEffect(() => { loadPromos(); }, []);

  const loadPromos = async () => {
    const { data } = await supabase
      .from('promos')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setPromos(data);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 flex items-end justify-start overflow-hidden pt-20"
        style={{ background: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.52)), url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80) center/cover no-repeat` }}
      >
        <div className="container mx-auto px-6 pb-10 animate-fade-in-up">
          <p className="section-label text-accent/70 mb-2">Limited Offers</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none">Special Promos</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {promos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promos.map((promo, i) => (
              <div
                key={promo.id}
                className="group border border-border rounded overflow-hidden hover:border-accent/30 hover:shadow-warm transition-all duration-300 animate-fade-in-up bg-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {promo.image_url ? (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={promo.image_url}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-warm flex items-center justify-center">
                    <Tag className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-body font-semibold tracking-widest uppercase rounded">
                      Active
                    </span>
                    {(promo.start_date || promo.end_date) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">
                          {promo.start_date && formatDate(promo.start_date)}
                          {promo.start_date && promo.end_date && ' – '}
                          {promo.end_date && formatDate(promo.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-foreground text-xl mb-2 group-hover:text-accent transition-colors duration-300">{promo.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Tag className="w-10 h-10 text-muted-foreground/25 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">No active promos</h3>
            <p className="font-body text-muted-foreground text-sm">Check back soon for exciting offers!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Promo;
