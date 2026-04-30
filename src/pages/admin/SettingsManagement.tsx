import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Building2, Phone, Mail, Globe, MapPin, BookOpen, BarChart2 } from 'lucide-react';

interface WebsiteSettings {
  id: string;
  business_name: string;
  business_tagline: string;
  business_description: string;
  logo_url: string | null;
  address: string;
  phone: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string;
  google_maps_api_key: string | null;
  about_title: string;
  about_subtitle: string;
  about_text: string;
  about_image_url: string | null;
  stats_years: string;
  stats_cups: string;
  stats_blends: string;
  stats_rating: string;
}

const SettingsManagement = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_settings')
        .update({
          business_name: settings.business_name,
          business_tagline: settings.business_tagline,
          business_description: settings.business_description,
          logo_url: settings.logo_url,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          instagram_url: settings.instagram_url,
          facebook_url: settings.facebook_url,
          latitude: settings.latitude,
          longitude: settings.longitude,
          opening_hours: settings.opening_hours,
          google_maps_api_key: settings.google_maps_api_key,
          about_title: settings.about_title,
          about_subtitle: settings.about_subtitle,
          about_text: settings.about_text,
          about_image_url: settings.about_image_url,
          stats_years: settings.stats_years,
          stats_cups: settings.stats_cups,
          stats_blends: settings.stats_blends,
          stats_rating: settings.stats_rating,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof WebsiteSettings, value: string | number | null) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
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

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No settings found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Website Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your website configuration</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="about">About / Story</TabsTrigger>
            <TabsTrigger value="stats">Stats Bar</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="location">Location & Maps</TabsTrigger>
          </TabsList>

          {/* Business Information */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Update your business name, tagline, and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL (Foto Logo)</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url || ''}
                    onChange={(e) => updateField('logo_url', e.target.value || null)}
                    placeholder="https://example.com/logo.png"
                  />
                  {settings.logo_url && (
                    <img src={settings.logo_url} alt="Logo preview" className="mt-2 w-12 h-12 object-cover rounded border" />
                  )}
                  <p className="text-xs text-muted-foreground">Kosongkan untuk menggunakan ikon kopi default</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name (Nama Cafe)</Label>
                  <Input
                    id="business_name"
                    value={settings.business_name}
                    onChange={(e) => updateField('business_name', e.target.value)}
                    placeholder="Lumino Cafe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_tagline">Tagline</Label>
                  <Input
                    id="business_tagline"
                    value={settings.business_tagline}
                    onChange={(e) => updateField('business_tagline', e.target.value)}
                    placeholder="Premium Coffee House"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_description">Description</Label>
                  <Textarea
                    id="business_description"
                    value={settings.business_description}
                    onChange={(e) => updateField('business_description', e.target.value)}
                    placeholder="Describe your business..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About / Story Section */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  About / Story Section
                </CardTitle>
                <CardDescription>
                  Edit the "Our Story" section displayed on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="about_title">Section Title</Label>
                    <Input
                      id="about_title"
                      value={settings.about_title || ''}
                      onChange={(e) => updateField('about_title', e.target.value)}
                      placeholder="Our Story"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about_subtitle">Section Label / Subtitle</Label>
                    <Input
                      id="about_subtitle"
                      value={settings.about_subtitle || ''}
                      onChange={(e) => updateField('about_subtitle', e.target.value)}
                      placeholder="More than just coffee"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about_text">Story Text</Label>
                  <Textarea
                    id="about_text"
                    value={settings.about_text || ''}
                    onChange={(e) => updateField('about_text', e.target.value)}
                    placeholder="Tell your cafe's story..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about_image_url">Story Image URL</Label>
                  <Input
                    id="about_image_url"
                    value={settings.about_image_url || ''}
                    onChange={(e) => updateField('about_image_url', e.target.value || null)}
                    placeholder="https://example.com/story-photo.jpg"
                  />
                  {settings.about_image_url && (
                    <img src={settings.about_image_url} alt="About preview" className="mt-2 w-40 h-32 object-cover rounded border" />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Bar */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Stats Bar
                </CardTitle>
                <CardDescription>
                  Edit the stats displayed below the hero section (Years, Cups, Blends, Rating)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stats_years">Years of Excellence</Label>
                    <Input
                      id="stats_years"
                      value={settings.stats_years || ''}
                      onChange={(e) => updateField('stats_years', e.target.value)}
                      placeholder="5+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stats_cups">Cups Served</Label>
                    <Input
                      id="stats_cups"
                      value={settings.stats_cups || ''}
                      onChange={(e) => updateField('stats_cups', e.target.value)}
                      placeholder="50K+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stats_blends">Unique Blends</Label>
                    <Input
                      id="stats_blends"
                      value={settings.stats_blends || ''}
                      onChange={(e) => updateField('stats_blends', e.target.value)}
                      placeholder="20+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stats_rating">Average Rating</Label>
                    <Input
                      id="stats_rating"
                      value={settings.stats_rating || ''}
                      onChange={(e) => updateField('stats_rating', e.target.value)}
                      placeholder="4.9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Details */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Details
                </CardTitle>
                <CardDescription>
                  Manage your contact information and business hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Street address..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+62 812-3456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="hello@luminocafe.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opening_hours">Opening Hours</Label>
                  <Input
                    id="opening_hours"
                    value={settings.opening_hours}
                    onChange={(e) => updateField('opening_hours', e.target.value)}
                    placeholder="09:00 - 22:00 WIB"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Media
                </CardTitle>
                <CardDescription>
                  Update your social media profile links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url}
                    onChange={(e) => updateField('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/luminocafe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url}
                    onChange={(e) => updateField('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/luminocafe"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location & Maps */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Maps
                </CardTitle>
                <CardDescription>
                  Set your GPS coordinates and Google Maps API key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={settings.latitude || ''}
                      onChange={(e) => updateField('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="-6.2088"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={settings.longitude || ''}
                      onChange={(e) => updateField('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="106.8456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_maps_api_key">Google Maps API Key (Optional)</Label>
                  <Input
                    id="google_maps_api_key"
                    value={settings.google_maps_api_key || ''}
                    onChange={(e) => updateField('google_maps_api_key', e.target.value)}
                    placeholder="AIzaSy..."
                    type="password"
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your API key from{' '}
                    <a
                      href="https://console.cloud.google.com/google/maps-apis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </p>
                </div>

                {settings.latitude && settings.longitude && (
                  <div className="space-y-2">
                    <Label>Map Preview</Label>
                    <div className="aspect-video rounded-lg overflow-hidden border">
                      <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${settings.longitude}!3d${settings.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1234567890`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsManagement;
