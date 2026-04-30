import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("customer_messages").insert([{
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        message: form.message.trim(),
      }]);
      if (error) throw error;
      setSent(true);
    } catch {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 300);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 animate-glow",
          isOpen && "scale-90"
        )}
        aria-label="Hubungi kami"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="gradient-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Hubungi Kami</p>
                <p className="text-white/80 text-xs">Kami akan segera membalas</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {sent ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-lg">Pesan Terkirim!</p>
              <p className="text-sm text-muted-foreground">
                Terima kasih telah menghubungi kami. Tim kami akan segera membalas pesan Anda.
              </p>
              <Button variant="outline" className="mt-2" onClick={handleClose}>
                Tutup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nama *</Label>
                  <Input
                    placeholder="Nama kamu"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="text-sm h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">No. HP</Label>
                  <Input
                    placeholder="08xxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="text-sm h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="text-sm h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Pesan *</Label>
                <Textarea
                  placeholder="Tulis pertanyaan atau pesan kamu di sini..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  className="text-sm resize-none min-h-24"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !form.name.trim() || !form.message.trim()}
                className="w-full gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                ) : (
                  <><Send className="w-4 h-4" /> Kirim Pesan</>
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                Balasan akan dikirim melalui email atau WhatsApp
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
