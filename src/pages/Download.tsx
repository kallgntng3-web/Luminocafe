import { Download, FileArchive, CheckCircle2, Terminal, Globe, Database } from 'lucide-react';

const steps = [
  {
    icon: Terminal,
    title: 'Install Dependencies',
    code: 'pnpm install',
  },
  {
    icon: Database,
    title: 'Konfigurasi Supabase',
    code: 'Edit src/integrations/supabase/client.ts\n→ Ganti URL & anon key dengan project Supabase Anda',
  },
  {
    icon: Globe,
    title: 'Jalankan Dev Server',
    code: 'pnpm dev',
  },
];

const includes = [
  'React + Vite + TypeScript',
  'Tailwind CSS + Shadcn UI',
  'Playfair Display + Inter fonts',
  '7 halaman publik lengkap',
  '12 halaman admin panel',
  'Supabase Auth + RLS',
  'Database schema & migrations',
  'Design system tokens',
];

const DownloadPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <FileArchive className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">
            Lumino Cafe — Source Code
          </h1>
          <p className="text-muted-foreground font-body">
            Full package siap download. Unzip, install, lalu jalankan.
          </p>
        </div>

        {/* Download Button */}
        <a
          href="/lumino-cafe-source.zip"
          download="lumino-cafe-source.zip"
          className="group flex items-center justify-center gap-3 w-full py-5 gradient-primary text-white font-body font-semibold text-base rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.01] shadow-warm mb-10"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          Download lumino-cafe-source.zip
        </a>

        {/* What's Included */}
        <div className="border border-border rounded-lg p-6 mb-8 bg-card">
          <h2 className="font-display font-semibold text-foreground text-lg mb-4">Isi Package</h2>
          <div className="grid grid-cols-2 gap-2">
            {includes.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="font-body text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-foreground text-lg">Cara Setup</h2>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 border border-border rounded-lg p-4 bg-card">
              <div className="w-8 h-8 rounded gradient-primary flex-shrink-0 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-body font-semibold text-foreground text-sm mb-1">
                  {i + 1}. {step.title}
                </p>
                <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">{step.code}</pre>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-body text-xs text-muted-foreground mt-10">
          Butuh Supabase project baru?{' '}
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            supabase.com
          </a>
          {' '}— gratis untuk project kecil.
        </p>

      </div>
    </div>
  );
};

export default DownloadPage;
