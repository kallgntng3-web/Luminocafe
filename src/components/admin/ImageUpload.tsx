import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
  aspectRatio?: 'auto' | 'square' | 'landscape' | 'portrait';
}

const ImageUpload = ({
  currentImageUrl,
  onUploadComplete,
  folder = 'general',
  label = 'Upload Image',
  hint,
  aspectRatio = 'auto',
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerClass = {
    auto: 'aspect-video',
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Hanya file JPG, PNG, GIF, atau WEBP yang diizinkan');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      // Generate unique filename
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('lumino-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('lumino-images')
        .getPublicUrl(fileName);

      onUploadComplete(data.publicUrl);
      toast.success('Foto berhasil diupload!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengupload foto. Silakan coba lagi.');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}

      <div
        className={`relative rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted/50 ${containerClass} cursor-pointer group transition-all hover:border-primary/50 hover:bg-muted`}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Ganti
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Mengupload...</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Klik untuk upload foto</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP (maks 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {/* Also allow URL input */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground px-2">atau gunakan link</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <input
        type="url"
        placeholder="https://link-foto-anda.com/foto.jpg"
        className="w-full text-sm px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        defaultValue={currentImageUrl || ''}
        onBlur={(e) => {
          const url = e.target.value.trim();
          if (url && url !== currentImageUrl) {
            setPreview(url);
            onUploadComplete(url);
          }
        }}
      />
      <p className="text-xs text-muted-foreground">
        Gunakan link dari <strong>Google Drive</strong> (share public), <strong>Imgur</strong>, <strong>imgBB</strong>, atau layanan hosting foto lainnya. Instagram/Facebook tidak bisa digunakan.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
