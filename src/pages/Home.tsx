import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Coffee, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
}

interface Review {
  id: string;
  customer_name: string;
  review_text: string;
  rating: number | null;
}

interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
}

interface HeroSection {
  badge_text: string;
  main_title: string;
  subtitle: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  background_image_url: string | null;
}

interface SiteSettings {
  about_title: string;
  about_subtitle: string;
  about_text: string;
  about_image_url: string | null;
  stats_years: string;
  stats_cups: string;
  stats_blends: string;
  stats_rating: string;
}

const Home = () => {
  const [featuredMenu, setFeaturedMenu] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [heroSection, setHeroSection] = useState<HeroSection>({
    badge_text: 'Premium Coffee Experience',
    main_title: 'Welcome to\nLumino Cafe',
    subtitle: 'Tempat sempurna untuk menikmati kopi berkualitas tinggi dengan suasana yang nyaman',
    cta_primary_text: 'Explore Menu',
    cta_secondary_text: 'Book a Table',
    background_image_url: null,
  });
  const [settings, setSettings] = useState<SiteSettings>({
    about_title: 'Our Story',
    about_subtitle: 'More than just coffee',
    about_text: 'Lumino Cafe lahir dari kecintaan mendalam terhadap kopi berkualitas dan keinginan menciptakan ruang yang menginspirasi. Setiap cangkir yang kami sajikan adalah hasil dari perjalanan panjang—dari pemilihan biji kopi terbaik hingga proses roasting yang sempurna oleh tangan-tangan terampil kami.',
    about_image_url: null,
    stats_years: '5+',
    stats_cups: '50K+',
    stats_blends: '20+',
    stats_rating: '4.9',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [heroRes, menuRes, reviewsRes, galleryRes, settingsRes] = await Promise.all([
        supabase.from('hero_section').select('*').limit(1).single(),
        supabase.from('menu_items').select('*').eq('is_available', true).limit(4),
        supabase.from('reviews').select('*').eq('is_featured', true).limit(3),
        supabase.from('gallery_photos').select('*').limit(6),
        supabase.from('website_settings').select('about_title,about_subtitle,about_text,about_image_url,stats_years,stats_cups,stats_blends,stats_rating').limit(1).single(),
      ]);

      if (heroRes.data) setHeroSection(heroRes.data);
      if (menuRes.data) setFeaturedMenu(menuRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (galleryRes.data) setGalleryPhotos(galleryRes.data);
      if (settingsRes.data) setSettings(prev => ({ ...prev, ...settingsRes.data }));
    };

    fetchData();
  }, []);

  const heroBg = heroSection.background_image_url
    ? `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.50)), url(${heroSection.background_image_url}) center/cover no-repeat`
    : `linear-gradient(160deg, hsl(220 13% 8%) 0%, hsl(22 38% 16%) 55%, hsl(22 42% 24%) 100%)`;

  return (
    <div className="min-h-screen">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ background: heroBg }}
      >
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Label */}
            <p className="section-label text-accent/80 mb-6 animate-fade-in-up">
              {heroSection.badge_text}
            </p>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[1.0] mb-8 animate-fade-in-up delay-100" style={{ whiteSpace: 'pre-line' }}>
              {heroSection.main_title}
            </h1>

            {/* Sub */}
            <p className="text-lg text-white/65 max-w-md leading-relaxed mb-12 animate-fade-in-up delay-200 font-body">
              {heroSection.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <Link to="/menu">
                <button className="group flex items-center gap-2 px-8 py-4 bg-accent text-foreground font-body font-semibold text-sm tracking-wide rounded hover:bg-accent/90 transition-all duration-300 hover:scale-[1.02]">
                  {heroSection.cta_primary_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/book">
                <button className="group flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-body font-medium text-sm tracking-wide rounded hover:border-white hover:bg-white/10 transition-all duration-300">
                  {heroSection.cta_secondary_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up delay-700">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/40 to-white/10" />
          <span className="text-white/35 text-[10px] font-body tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
            {[
              { value: settings.stats_years, label: 'Years of Excellence' },
              { value: settings.stats_cups, label: 'Cups Served' },
              { value: settings.stats_blends, label: 'Unique Blends' },
              { value: settings.stats_rating, label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:px-8 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-4xl font-display font-bold text-accent mb-1">{stat.value}</p>
                <p className="text-xs font-body text-primary-foreground/60 tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ────────────────────────────────────────── */}
      <section className="py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative animate-fade-in-left">
              <div className="aspect-[4/5] rounded overflow-hidden bg-muted">
                <img
                  src={settings.about_image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80'}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80';
                  }}
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded shadow-warm hidden md:block">
                <p className="text-2xl font-display font-bold text-foreground">Since</p>
                <p className="text-4xl font-display font-bold text-foreground">2019</p>
              </div>
            </div>

            {/* Text */}
            <div className="animate-fade-in-right">
              <p className="section-label mb-4">{settings.about_subtitle}</p>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-8">
                {settings.about_title}
              </h2>
              <div className="w-12 h-[2px] bg-accent mb-8 animate-line" />
              <p className="text-muted-foreground font-body leading-relaxed text-base mb-8">
                {settings.about_text}
              </p>
              <Link to="/menu">
                <button className="group flex items-center gap-2 text-sm font-body font-semibold text-foreground border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors duration-300">
                  Explore Our Menu
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED MENU ────────────────────────────────────── */}
      <section
        className="py-28 relative"
        style={{
          background: `linear-gradient(rgba(12,8,5,0.88), rgba(12,8,5,0.88)), url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80) center/cover fixed`,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
            <div>
              <p className="section-label text-accent/70 mb-3">Our Signature</p>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                Menu Favorit
              </h2>
            </div>
            <Link to="/menu">
              <button className="group flex items-center gap-2 text-sm font-body font-medium text-white/60 hover:text-white transition-colors">
                View All Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMenu.map((item, i) => (
              <div
                key={item.id}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="aspect-square rounded overflow-hidden bg-white/5 mb-4 relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="w-12 h-12 text-white/15" />
                    </div>
                  )}
                  {/* Price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-accent font-display font-bold text-xl">
                      {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : '—'}
                    </p>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-1 group-hover:text-accent transition-colors duration-300">{item.name}</h3>
                {item.description && (
                  <p className="text-white/45 font-body text-sm line-clamp-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR CRAFT / FEATURES ─────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Why Lumino</p>
            <h2 className="text-5xl font-display font-bold text-foreground">Crafted with Passion</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-border rounded overflow-hidden">
            {[
              {
                img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
                title: 'Premium Beans',
                desc: 'Sourced from the world\'s finest single-origin farms, roasted in-house to perfection.',
              },
              {
                img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
                title: 'Skilled Baristas',
                desc: 'Our certified baristas craft each cup with precision and a deep love for the craft.',
              },
              {
                img: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80',
                title: 'Inviting Space',
                desc: 'A warm, beautifully curated space designed for work, connection, and relaxation.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden animate-fade-in-up ${i > 0 ? 'border-l border-border' : ''}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section
          className="py-28 relative"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)), url(https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&q=80) center/cover fixed`,
          }}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="section-label text-accent/70 mb-3">Testimonials</p>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                Apa Kata Mereka
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="border border-white/10 rounded p-8 hover:border-white/25 transition-colors duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-white/80 font-body text-base leading-relaxed mb-6 italic">
                    "{review.review_text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-accent" />
                    <p className="font-body font-medium text-white/60 text-sm">{review.customer_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY PREVIEW ──────────────────────────────────── */}
      {galleryPhotos.length > 0 && (
        <section className="py-28">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="section-label mb-3">#LuminoMoment</p>
                <h2 className="text-5xl font-display font-bold text-foreground">Gallery</h2>
              </div>
              <Link to="/gallery">
                <button className="group flex items-center gap-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View All Photos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryPhotos.slice(0, 6).map((photo, i) => (
                <div
                  key={photo.id}
                  className={`overflow-hidden rounded group cursor-pointer animate-scale-in ${
                    i === 0 ? 'md:row-span-2' : ''
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`${i === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'} overflow-hidden`}>
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Gallery'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section
        className="py-32 relative"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url(https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1920&q=80) center/cover fixed`,
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="section-label text-accent/70 mb-6 animate-fade-in-up">Experience Lumino</p>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 max-w-3xl mx-auto leading-tight animate-fade-in-up delay-100">
            Siap untuk pengalaman kopi terbaik?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-12 text-lg animate-fade-in-up delay-200">
            Reservasi meja Anda sekarang dan nikmati promo spesial kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link to="/book">
              <button className="group flex items-center justify-center gap-2 px-10 py-4 bg-accent text-foreground font-body font-semibold text-sm tracking-wide rounded hover:bg-accent/90 transition-all duration-300 hover:scale-[1.02]">
                Reservasi Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/promo">
              <button className="group flex items-center justify-center gap-2 px-10 py-4 border border-white/40 text-white font-body font-medium text-sm tracking-wide rounded hover:border-white hover:bg-white/10 transition-all duration-300">
                Lihat Promo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
