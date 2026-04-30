import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowRight, CalendarCheck, Clock, Users } from 'lucide-react';

const BookTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    number_of_guests: 2,
    special_request: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert([formData]);
      if (error) throw error;
      toast.success('Booking submitted! We will contact you soon.');
      navigate('/');
    } catch {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="min-h-screen grid lg:grid-cols-2 pt-20">

        {/* Left — Photo Panel */}
        <div
          className="hidden lg:flex flex-col justify-end p-16 relative overflow-hidden"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85) center/cover no-repeat`,
          }}
        >
          <div className="relative z-10 animate-fade-in-left">
            <p className="section-label text-accent/70 mb-4">Lumino Cafe</p>
            <h1 className="text-5xl font-display font-bold text-white leading-tight mb-6">
              Reserve Your<br />Perfect Moment
            </h1>
            <p className="text-white/60 font-body text-base leading-relaxed max-w-sm mb-10">
              Book a table and let us take care of the rest. Enjoy premium coffee in a serene setting.
            </p>

            {/* Info tiles */}
            <div className="space-y-3">
              {[
                { icon: Clock, label: 'Open Hours', value: '10:00 – 23:00 daily' },
                { icon: CalendarCheck, label: 'Confirmation', value: 'Via phone or email' },
                { icon: Users, label: 'Group Booking', value: 'Up to 20 guests' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 border border-white/10 rounded p-4 bg-white/5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded flex-shrink-0 flex items-center justify-center bg-accent/20">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-white/40 uppercase tracking-wide">{label}</p>
                    <p className="font-body text-sm text-white/80">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex items-center justify-center p-8 md:p-14 bg-background">
          <div className="w-full max-w-md animate-fade-in-right">
            {/* Mobile header */}
            <div className="lg:hidden mb-8">
              <p className="section-label mb-2">Lumino Cafe</p>
              <h1 className="text-4xl font-display font-bold text-foreground">Book a Table</h1>
            </div>

            <h2 className="hidden lg:block text-3xl font-display font-bold text-foreground mb-2">Reservation Details</h2>
            <p className="hidden lg:block font-body text-muted-foreground text-sm mb-8">Fill in your details and we'll confirm your booking shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Full Name *</Label>
                  <Input name="customer_name" value={formData.customer_name} onChange={handleChange} required placeholder="Your name" className="font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Phone *</Label>
                  <Input name="customer_phone" type="tel" value={formData.customer_phone} onChange={handleChange} required placeholder="08xxxxxxxxx" className="font-body" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Email *</Label>
                <Input name="customer_email" type="email" value={formData.customer_email} onChange={handleChange} required placeholder="your@email.com" className="font-body" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Date *</Label>
                  <Input name="booking_date" type="date" value={formData.booking_date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Time *</Label>
                  <Input name="booking_time" type="time" value={formData.booking_time} onChange={handleChange} required min="10:00" max="23:00" className="font-body" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Guests *</Label>
                <Input name="number_of_guests" type="number" min="1" max="20" value={formData.number_of_guests} onChange={handleChange} required className="font-body" />
              </div>

              <div className="space-y-1.5">
                <Label className="font-body text-xs font-medium tracking-wide uppercase text-muted-foreground">Special Request</Label>
                <Textarea name="special_request" value={formData.special_request} onChange={handleChange} placeholder="Dietary requirements, seating preference..." rows={3} className="font-body resize-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-wide rounded hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : (
                  <>Submit Reservation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default BookTable;
