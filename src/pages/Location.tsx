import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, ArrowUpRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteSettings {
  address: string;
  phone: string;
  email: string;
  instagram_url: string;
  opening_hours: string;
  latitude: number | null;
  longitude: number | null;
}

const Location = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('address, phone, email, instagram_url, opening_hours, latitude, longitude')
          .limit(1)
          .single();
        if (data) setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    load();
  }, []);

  const address = settings?.address || 'Lumino Cafe - BSD, BSD Tangerang, Indonesia';
  const phone = settings?.phone || '08xxxxxxx';
  const email = settings?.email || 'info@luminocafe.com';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com/luminocafe';
  const openingHours = settings?.opening_hours || '10:00 - 23:00';
  const hasCoordinates = settings?.latitude && settings?.longitude;

  const contactItems = [
    { icon: MapPin, label: 'Address', value: address, href: null },
    { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone}` },
    { icon: Clock, label: 'Hours', value: `Open daily · ${openingHours}`, href: null },
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Instagram, label: 'Instagram', value: '@luminocafe', href: instagramUrl },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 flex items-end justify-start overflow-hidden pt-20"
        style={{ background: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.52)), url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80) center/cover no-repeat` }}
      >
        <div className="container mx-auto px-6 pb-10 animate-fade-in-up">
          <p className="section-label text-accent/70 mb-2">Come Visit Us</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none">Find Us</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">

          {/* Contact Info */}
          <div className="lg:col-span-2 animate-fade-in-left">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Get in Touch</h2>

            <div className="space-y-0 border border-border rounded overflow-hidden">
              {contactItems.map(({ icon: Icon, label, value, href }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 p-5 hover:bg-muted/40 transition-colors ${
                    i < contactItems.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded flex-shrink-0 flex items-center justify-center bg-accent/10">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="font-body text-sm text-foreground hover:text-accent transition-colors flex items-center gap-1 group"
                      >
                        {value}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <p className="font-body text-sm text-foreground">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 animate-fade-in-right">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Our Location</h2>
            <div className="rounded overflow-hidden border border-border aspect-[4/3] bg-muted">
              {hasCoordinates ? (
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${settings!.longitude}!3d${settings!.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1234567890`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lumino Cafe Location"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="font-body text-sm text-muted-foreground">Map coordinates not configured</p>
                    <p className="font-body text-xs text-muted-foreground/60 mt-1">Set via admin settings</p>
                  </div>
                </div>
              )}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Easy to find with ample parking space available
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Location;
