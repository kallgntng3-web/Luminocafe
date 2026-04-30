import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, X, Check } from 'lucide-react';

interface AllYouCanDrink {
  id: string;
  price: number;
  features: string[];
  terms: string[];
  duration_info: string;
  contact_info: string;
}

const AYCDManagement = () => {
  const [aycd, setAycd] = useState<AllYouCanDrink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTerm, setNewTerm] = useState('');

  useEffect(() => {
    loadAYCD();
  }, []);

  const loadAYCD = async () => {
    try {
      const { data, error } = await supabase
        .from('all_you_can_drink')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setAycd(data);
    } catch (error) {
      console.error('Error loading AYCD:', error);
      toast.error('Failed to load All You Can Drink data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!aycd) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('all_you_can_drink')
        .update({
          price: aycd.price,
          features: aycd.features,
          terms: aycd.terms,
          duration_info: aycd.duration_info,
          contact_info: aycd.contact_info,
          updated_at: new Date().toISOString(),
        })
        .eq('id', aycd.id);

      if (error) throw error;
      toast.success('All You Can Drink package saved successfully!');
    } catch (error) {
      console.error('Error saving AYCD:', error);
      toast.error('Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AllYouCanDrink, value: number | string) => {
    if (aycd) {
      setAycd({ ...aycd, [field]: value });
    }
  };

  const addFeature = () => {
    if (!aycd || !newFeature.trim()) return;
    setAycd({ ...aycd, features: [...aycd.features, newFeature.trim()] });
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    if (!aycd) return;
    setAycd({ ...aycd, features: aycd.features.filter((_, i) => i !== index) });
  };

  const addTerm = () => {
    if (!aycd || !newTerm.trim()) return;
    setAycd({ ...aycd, terms: [...aycd.terms, newTerm.trim()] });
    setNewTerm('');
  };

  const removeTerm = (index: number) => {
    if (!aycd) return;
    setAycd({ ...aycd, terms: aycd.terms.filter((_, i) => i !== index) });
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

  if (!aycd) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No AYCD data found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All You Can Drink Package</h1>
            <p className="text-muted-foreground mt-1">Manage AYCD package details</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Pricing</CardTitle>
                <CardDescription>Set the price for the package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={aycd.price}
                    onChange={(e) => updateField('price', parseFloat(e.target.value))}
                    placeholder="50000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
                <CardDescription>Duration and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_info">Duration Info</Label>
                  <Input
                    id="duration_info"
                    value={aycd.duration_info}
                    onChange={(e) => updateField('duration_info', e.target.value)}
                    placeholder="Available daily from 10:00 - 23:00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_info">Contact Info</Label>
                  <Input
                    id="contact_info"
                    value={aycd.contact_info}
                    onChange={(e) => updateField('contact_info', e.target.value)}
                    placeholder="For more information, contact us at..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Features</CardTitle>
                <CardDescription>What's included in the package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button onClick={addFeature} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {aycd.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg group"
                    >
                      <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Package rules and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Add a term..."
                    onKeyPress={(e) => e.key === 'Enter' && addTerm()}
                  />
                  <Button onClick={addTerm} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {aycd.terms.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg group"
                    >
                      <span className="flex-1 text-sm">{term}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeTerm(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AYCDManagement;
