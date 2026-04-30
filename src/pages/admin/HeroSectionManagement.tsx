import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

interface HeroSection {
  id: string;
  badge_text: string;
  main_title: string;
  subtitle: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  background_image_url: string | null;
}

const HeroSectionManagement = () => {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHeroSection();
  }, []);

  const loadHeroSection = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setHeroSection(data);
    } catch (error) {
      console.error('Error loading hero section:', error);
      toast.error('Failed to load hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!heroSection) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_section')
        .update({
          badge_text: heroSection.badge_text,
          main_title: heroSection.main_title,
          subtitle: heroSection.subtitle,
          cta_primary_text: heroSection.cta_primary_text,
          cta_secondary_text: heroSection.cta_secondary_text,
          background_image_url: heroSection.background_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', heroSection.id);

      if (error) throw error;
      toast.success('Hero section saved successfully!');
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof HeroSection, value: string | null) => {
    if (heroSection) {
      setHeroSection({ ...heroSection, [field]: value });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!heroSection) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hero Section</h1>
            <p className="text-muted-foreground mt-1">Manage homepage hero content</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6">
            {/* Background Image */}
            <Card>
              <CardHeader>
                <CardTitle>Background Photo</CardTitle>
                <CardDescription>
                  Upload foto background hero section (portrait atau landscape)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImageUrl={heroSection.background_image_url}
                  onUploadComplete={(url) => updateField('background_image_url', url || null)}
                  folder="hero"
                  aspectRatio="landscape"
                  hint="Foto akan otomatis menyesuaikan ukuran layar. Bisa portrait maupun landscape."
                />
              </CardContent>
            </Card>

            {/* Text Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Teks Hero
                </CardTitle>
                <CardDescription>Edit teks yang ditampilkan di hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={heroSection.badge_text}
                    onChange={(e) => updateField('badge_text', e.target.value)}
                    placeholder="Premium Coffee Experience"
                  />
                  <p className="text-xs text-muted-foreground">Teks kecil di atas judul</p>
                </div>

                <div className="space-y-2">
                  <Label>Main Title</Label>
                  <Input
                    value={heroSection.main_title}
                    onChange={(e) => updateField('main_title', e.target.value)}
                    placeholder="Welcome to Lumino Cafe"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={heroSection.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="Deskripsi singkat..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tombol Utama</Label>
                    <Input
                      value={heroSection.cta_primary_text}
                      onChange={(e) => updateField('cta_primary_text', e.target.value)}
                      placeholder="Lihat Menu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tombol Sekunder</Label>
                    <Input
                      value={heroSection.cta_secondary_text}
                      onChange={(e) => updateField('cta_secondary_text', e.target.value)}
                      placeholder="Reservasi"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <Card className="xl:sticky xl:top-6 h-fit">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Tampilan hero section</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div
                className="relative rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center"
                style={{
                  background: heroSection.background_image_url
                    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroSection.background_image_url}) center/cover no-repeat`
                    : 'linear-gradient(135deg, hsl(25 45% 25%), hsl(30 35% 15%))',
                }}
              >
                <div className="text-center p-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs text-white font-medium">{heroSection.badge_text}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {heroSection.main_title}
                  </h1>
                  <p className="text-sm text-white/80 max-w-xs mx-auto">
                    {heroSection.subtitle}
                  </p>
                  <div className="flex gap-2 justify-center pt-1">
                    <span className="px-3 py-1.5 bg-yellow-400 text-brown-900 rounded-lg text-xs font-semibold">
                      {heroSection.cta_primary_text}
                    </span>
                    <span className="px-3 py-1.5 border-2 border-white text-white rounded-lg text-xs font-semibold">
                      {heroSection.cta_secondary_text}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroSectionManagement;
