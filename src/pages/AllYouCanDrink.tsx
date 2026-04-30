import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

interface AllYouCanDrink {
  price: number;
  features: string[];
  terms: string[];
  duration_info: string;
  contact_info: string;
}

const AllYouCanDrink = () => {
  const [aycd, setAycd] = useState<AllYouCanDrink>({
    price: 50000,
    features: [
      'Unlimited Coffee & Espresso Based Drinks',
      'Unlimited Non-Coffee Beverages',
      'Unlimited Tea Selection',
      'Free Refill on All Drinks',
      'Cozy & Comfortable Space',
      'Fast WiFi Connection',
      'Instagram-Worthy Interior',
      'Friendly Staff Service',
    ],
    terms: [
      'Minimum 2 hours duration',
      'No outside food & beverages allowed',
      'Reservation recommended for groups',
      'Subject to seat availability',
    ],
    duration_info: 'Available daily from 10:00 - 23:00',
    contact_info: 'For more information, contact us at 08xxxxxxx',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAYCD(); }, []);

  const loadAYCD = async () => {
    try {
      const { data } = await supabase.from('all_you_can_drink').select('*').limit(1).single();
      if (data) setAycd(data);
    } catch (error) {
      console.error('Error loading AYCD:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 flex items-end justify-start overflow-hidden pt-20"
        style={{ background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=1920&q=80) center/cover no-repeat` }}
      >
        <div className="container mx-auto px-6 pb-10 animate-fade-in-up">
          <p className="section-label text-accent/70 mb-2">Special Package</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-none">All You Can Drink</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12 items-start">

          {/* Price Card */}
          <div className="lg:col-span-2 animate-fade-in-left">
            <div className="border border-border rounded p-8 text-center sticky top-28">
              <p className="section-label mb-3">Starting From</p>
              <p className="text-6xl font-display font-bold text-accent mb-1">
                Rp {aycd.price.toLocaleString('id-ID')}
              </p>
              <p className="font-body text-muted-foreground text-sm mb-8">per person</p>

              <div className="space-y-2 mb-8 text-left">
                <p className="font-body text-xs text-muted-foreground">{aycd.duration_info}</p>
                <p className="font-body text-xs text-muted-foreground">{aycd.contact_info}</p>
              </div>

              <div className="space-y-3">
                <Link to="/book">
                  <button className="group w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded hover:bg-primary/90 transition-all duration-300">
                    Book Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/menu">
                  <button className="w-full py-3.5 border border-border text-foreground font-body font-medium text-sm rounded hover:bg-muted transition-colors duration-300">
                    View Full Menu
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Features + T&C */}
          <div className="lg:col-span-3 animate-fade-in-right">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">What's Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {aycd.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded border border-border bg-card hover:border-accent/30 transition-colors duration-300">
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <span className="font-body text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border border-border rounded p-6 bg-muted/30">
              <h3 className="font-display font-semibold text-foreground mb-4">Terms & Conditions</h3>
              <ul className="space-y-2">
                {aycd.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                    <span className="text-accent mt-0.5">—</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllYouCanDrink;
