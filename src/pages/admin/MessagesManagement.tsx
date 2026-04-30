import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Mail, Phone, Clock, Send, Loader2, Inbox } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type CustomerMessage = Database['public']['Tables']['customer_messages']['Row'];

export default function MessagesManagement() {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomerMessage | null>(null);
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('customer_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const openMessage = async (msg: CustomerMessage) => {
    setSelected(msg);
    setReply(msg.reply || '');
    // Mark as read if unread
    if (msg.status === 'unread') {
      await supabase
        .from('customer_messages')
        .update({ status: 'read' })
        .eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
    }
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    setReplying(true);
    try {
      const { error } = await supabase
        .from('customer_messages')
        .update({
          reply: reply.trim(),
          status: 'replied',
          replied_at: new Date().toISOString(),
        })
        .eq('id', selected.id);
      if (error) throw error;
      toast.success('Balasan tersimpan!');
      setMessages(prev => prev.map(m =>
        m.id === selected.id
          ? { ...m, reply: reply.trim(), status: 'replied', replied_at: new Date().toISOString() }
          : m
      ));
      setSelected(prev => prev ? { ...prev, reply: reply.trim(), status: 'replied', replied_at: new Date().toISOString() } : null);
    } catch {
      toast.error('Gagal menyimpan balasan.');
    } finally {
      setReplying(false);
    }
  };

  const statusBadge = (status: string | null) => {
    if (status === 'replied') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Dibalas</Badge>;
    if (status === 'read') return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Dibaca</Badge>;
    return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">Baru</Badge>;
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'replied') return m.status === 'replied';
    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pesan Pelanggan</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} pesan baru belum dibaca` : 'Semua pesan sudah dibaca'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadMessages}>Refresh</Button>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">
              Semua <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">{messages.length}</span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Belum Dibaca
              {unreadCount > 0 && <span className="ml-1.5 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="replied">
              Sudah Dibalas <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">{messages.filter(m => m.status === 'replied').length}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16 gap-3">
              <Inbox className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">Tidak ada pesan</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(msg => (
              <Card
                key={msg.id}
                className={`cursor-pointer hover:shadow-warm transition-all duration-200 hover:-translate-y-0.5 ${msg.status === 'unread' ? 'border-primary/40 bg-primary/5' : ''}`}
                onClick={() => openMessage(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${msg.status === 'unread' ? 'gradient-primary' : 'bg-muted'}`}>
                        <MessageSquare className={`w-4 h-4 ${msg.status === 'unread' ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-semibold text-sm ${msg.status === 'unread' ? 'text-foreground' : ''}`}>{msg.name}</p>
                          {statusBadge(msg.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{msg.message}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                          {msg.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</span>}
                          {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{msg.phone}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(msg.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Pesan dari {selected?.name}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Contact info */}
              <div className="flex flex-wrap gap-3 text-sm">
                {selected.email && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-4 h-4" /> {selected.email}
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-4 h-4" /> {selected.phone}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {formatDate(selected.created_at)}
                </div>
              </div>

              {/* Message */}
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Pesan</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Previous reply if any */}
              {selected.reply && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Balasan Sebelumnya</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.reply}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(selected.replied_at)}</p>
                </div>
              )}

              {/* Reply form */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {selected.reply ? 'Ubah Balasan' : 'Tulis Balasan'}
                </label>
                <Textarea
                  placeholder="Tulis balasan untuk pelanggan..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  className="min-h-28 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Balasan ini untuk referensi internal. Hubungi pelanggan via email/WhatsApp secara manual.
                </p>
              </div>

              <Button
                onClick={sendReply}
                disabled={replying || !reply.trim()}
                className="w-full gap-2"
              >
                {replying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><Send className="w-4 h-4" /> {selected.reply ? 'Perbarui Balasan' : 'Simpan Balasan'}</>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
