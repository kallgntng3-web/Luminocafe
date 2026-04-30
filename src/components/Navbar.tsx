import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('Lumino Cafe');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('logo_url, business_name')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
        if (data?.business_name) setBusinessName(data.business_name);
      });
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const nameParts = businessName.trim().split(' ');
  const nameFirst = nameParts[0];
  const nameRest = nameParts.slice(1).join(' ');

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/all-you-can-drink', label: 'All You Can Drink' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/promo', label: 'Promo' },
    { path: '/location', label: 'Location' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const isHeroPage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-sm'
          : isHeroPage
          ? 'bg-transparent'
          : 'bg-card/95 backdrop-blur-xl border-b border-border'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden ${
                !logoUrl ? (scrolled || !isHeroPage ? 'gradient-primary' : 'bg-white/15 backdrop-blur-sm') : ''
              }`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
              ) : (
                <Coffee className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <span
                className={`text-xl font-display font-bold tracking-tight transition-colors duration-300 ${
                  scrolled || !isHeroPage ? 'text-foreground' : 'text-white'
                }`}
              >
                {nameFirst}
              </span>
              {nameRest && (
                <span className="text-xl font-display font-normal tracking-tight text-accent">
                  {' '}{nameRest}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-body font-medium transition-colors duration-200 tracking-wide group ${
                  isActive(link.path)
                    ? scrolled || !isHeroPage
                      ? 'text-foreground'
                      : 'text-white'
                    : scrolled || !isHeroPage
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Reservasi CTA */}
          <div className="hidden lg:block">
            <Link to="/book">
              <button
                className={`px-5 py-2.5 text-sm font-body font-semibold tracking-wide border transition-all duration-300 rounded hover:scale-[1.02] ${
                  scrolled || !isHeroPage
                    ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    : 'border-white text-white hover:bg-white hover:text-primary'
                }`}
              >
                Reservasi
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded transition-colors ${
              scrolled || !isHeroPage || isOpen ? 'text-foreground' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-6 pt-2 space-y-1 border-t border-border animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2.5 text-sm font-body font-medium rounded transition-colors ${
                  isActive(link.path)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/book">
                <button className="w-full py-2.5 text-sm font-body font-semibold border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Reservasi Sekarang
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
