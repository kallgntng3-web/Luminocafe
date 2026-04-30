import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteSettings {
  business_name: string;
  business_tagline: string;
  business_description: string;
  address: string;
  phone: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('website_settings')
        .select('business_name, business_tagline, business_description, address, phone, email, instagram_url, facebook_url')
        .limit(1)
        .single();
      if (data) setSettings(data);
    };
    load();
  }, []);

  const businessName = settings?.business_name || 'Lumino Cafe';
  const businessTagline = settings?.business_tagline || 'Premium Coffee House';
  const businessDescription = settings?.business_description || 'Tempat sempurna untuk menikmati kopi berkualitas tinggi dengan suasana yang nyaman dan modern.';
  const address = settings?.address || 'Jl. Contoh No. 123, Jakarta Selatan, 12345';
  const phone = settings?.phone || '+62 812-3456-7890';
  const email = settings?.email || 'hello@luminocafe.com';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com';
  const facebookUrl = settings?.facebook_url || 'https://facebook.com';

  const quickLinks = [
    { to: '/menu', label: 'Our Menu' },
    { to: '/all-you-can-drink', label: 'All You Can Drink' },
    { to: '/promo', label: 'Promos' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/location', label: 'Location' },
    { to: '/book', label: 'Book a Table' },
  ];

  return (
    <footer style={{ background: 'hsl(220 13% 9%)' }}>
      {/* Top section */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand — wider column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">{businessName}</h3>
                <p className="text-xs font-body text-white/40 tracking-wider uppercase">{businessTagline}</p>
              </div>
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              {businessDescription}
            </p>
            <div className="flex gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded border border-white/10 text-white/40 hover:text-white hover:border-white/30 flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded border border-white/10 text-white/40 hover:text-white hover:border-white/30 flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-body text-xs font-semibold tracking-[0.18em] uppercase text-white/30 mb-6">Navigate</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1.5 font-body text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5">
            <h4 className="font-body text-xs font-semibold tracking-[0.18em] uppercase text-white/30 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/50 leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`tel:${phone}`} className="font-body text-sm text-white/50 hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href={`mailto:${email}`} className="font-body text-sm text-white/50 hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-white/25">
            © 2026 {businessName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-white/25 hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="font-body text-xs text-white/25 hover:text-white/60 transition-colors">Terms of Service</a>
            <Link to="/admin/login" className="font-body text-xs text-white/25 hover:text-white/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
