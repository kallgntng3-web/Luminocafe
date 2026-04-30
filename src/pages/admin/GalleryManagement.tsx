import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Star } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

const GalleryManagement = () => {
  const [photos, setPhotos] = useState<Database['public']['Tables']['gallery_photos']['Row'][]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    is_featured: false,
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('display_order');
    if (data) setPhotos(data);
  };

  const resetForm = () => {
    setFormData({ image_url: '', caption: '', is_featured: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Silakan upload foto atau masukkan link foto terlebih dahulu');
      return;
    }
    try {
      const { error } = await supabase.from('gallery_photos').insert([formData]);
      if (error) throw error;
      toast.success('Foto berhasil ditambahkan ke gallery!');
      setIsDialogOpen(false);
      resetForm();
      loadPhotos();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan foto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;
    try {
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Foto berhasil dihapus!');
      loadPhotos();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus foto');
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('gallery_photos')
      .update({ is_featured: !current })
      .eq('id', id);
    if (!error) {
      loadPhotos();
      toast.success(`Foto ${!current ? 'ditampilkan' : 'disembunyikan'} di homepage`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Gallery</h1>
            <p className="text-muted-foreground mt-1">{photos.length} foto tersimpan</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Foto
          </Button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-muted">
                {photo.image_url ? (
                  <img
                    src={photo.image_url}
                    alt={photo.caption || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No Image</span>
                  </div>
                )}
              </div>

              {photo.caption && (
                <div className="px-2 py-1.5 text-xs text-center truncate">{photo.caption}</div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant={photo.is_featured ? 'default' : 'secondary'}
                  onClick={() => toggleFeatured(photo.id, photo.is_featured || false)}
                  title="Toggle featured di homepage"
                >
                  <Star className={`h-4 w-4 ${photo.is_featured ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(photo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {photo.is_featured && (
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Featured
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>Belum ada foto di gallery.</p>
            <p className="text-sm mt-1">Klik "Tambah Foto" untuk mulai upload.</p>
          </div>
        )}
      </div>

      {/* Add Photo Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Foto Gallery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              currentImageUrl={formData.image_url}
              onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
              folder="gallery"
              label="Foto"
              aspectRatio="auto"
              hint="Upload foto portrait atau landscape, foto akan otomatis menyesuaikan."
            />

            <div className="space-y-2">
              <Label htmlFor="caption">Caption (opsional)</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Deskripsi foto..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Tampilkan di Homepage</Label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">Simpan</Button>
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default GalleryManagement;
