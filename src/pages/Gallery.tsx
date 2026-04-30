import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Image } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

const Gallery = () => {
  const [photos, setPhotos] = useState<Database['public']['Tables']['gallery_photos']['Row'][]>([]);

  useEffect(() => { loadPhotos(); }, []);

  const loadPhotos = async () => {
    const { data } = await supabase.from('gallery_photos').select('*').order('display_order');
    if (data) setPhotos(data);
  };

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 flex items-end justify-start overflow-hidden pt-20"
        style={{ background: `linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.50)), url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80) center/cover no-repeat` }}
      >
        <div className="container mx-auto px-6 pb-10 animate-fade-in-up">
          <p className="section-label text-accent/70 mb-2">#LuminoMoment</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none">Gallery</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {photos.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded break-inside-avoid cursor-pointer animate-scale-in"
                style={{ animationDelay: `${Math.min(i * 60, 500)}ms` }}
              >
                {photo.image_url ? (
                  <>
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Gallery photo'}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Caption overlay */}
                    {photo.caption && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="font-body text-sm text-white">{photo.caption}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Image className="w-10 h-10 text-muted-foreground/25 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">No photos yet</h3>
            <p className="font-body text-muted-foreground text-sm">Check back soon for beautiful moments!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gallery;
