const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_TOKEN = Deno.env.get("AI_API_TOKEN_952c3e11f050");
    if (!AI_API_TOKEN) {
      throw new Error("AI_API_TOKEN is not configured");
    }

    const { messages, mode, context } = await req.json();

    let systemPrompt = "";
    if (mode === "chatbot") {
      systemPrompt = `Kamu adalah asisten virtual Lumino Cafe yang ramah dan helpful.
Lumino Cafe adalah premium coffee house yang menawarkan berbagai minuman kopi dan non-kopi berkualitas tinggi.
${context?.menu ? `Menu yang tersedia: ${context.menu}` : ""}
${context?.promos ? `Promo aktif: ${context.promos}` : ""}
${context?.settings ? `Info cafe: ${JSON.stringify(context.settings)}` : ""}
Tugas kamu:
- Bantu pelanggan tanya tentang menu, harga, promo, dan reservasi
- Rekomendasikan minuman berdasarkan preferensi pelanggan
- Berikan info tentang lokasi, jam buka, dan fasilitas
- Selalu gunakan Bahasa Indonesia yang ramah dan natural
- Jawab singkat, padat, dan informatif (maks 3-4 kalimat per respons)
- Jika ditanya diluar topik cafe, arahkan kembali ke topik cafe`;
    } else if (mode === "recommendation") {
      systemPrompt = `Kamu adalah barista expert Lumino Cafe.
${context?.menu ? `Menu yang tersedia: ${context.menu}` : ""}
Berikan rekomendasi minuman yang personal berdasarkan preferensi pelanggan.
Format respons: berikan 2-3 rekomendasi dengan nama menu, alasan singkat, dan emoji yang sesuai.
Gunakan bahasa Indonesia yang casual dan menarik.`;
    } else if (mode === "review") {
      systemPrompt = `Kamu adalah penulis review kafe profesional.
Bantu pelanggan menulis ulasan yang jujur, natural, dan informatif untuk Lumino Cafe.
Buat review yang personal, tidak terlalu formal, dan mencerminkan pengalaman mereka.
Panjang review: 3-5 kalimat. Bahasa Indonesia yang natural.`;
    } else if (mode === "content") {
      systemPrompt = `Kamu adalah copywriter profesional untuk Lumino Cafe.
Buat konten pemasaran yang menarik, engaging, dan sesuai brand Lumino Cafe (premium, modern, cozy).
Gunakan bahasa Indonesia yang elegan namun tetap accessible.
Sertakan emoji yang relevan untuk social media appeal.`;
    }

    const response = await fetch("https://api.enter.pro/code/api/v1/ai/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-pro-preview",
        system: systemPrompt,
        messages,
        stream: true,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Layanan AI sementara tidak tersedia.";
      let errorCode = "api_error";
      const dataMatch = text.match(/data: (.+)/);
      if (dataMatch) {
        try {
          const errorData = JSON.parse(dataMatch[1]);
          errorMessage = errorData.error?.message || errorMessage;
          errorCode = errorData.error?.type || errorCode;
        } catch { /* use defaults */ }
      }
      const errorSSE = `event: error\ndata: ${JSON.stringify({
        type: "error",
        error: { type: errorCode, message: errorMessage }
      })}\n\n`;
      return new Response(errorSSE, {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" }
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const errorSSE = `event: error\ndata: ${JSON.stringify({
      type: "error",
      error: { type: "api_error", message: error.message }
    })}\n\n`;
    return new Response(errorSSE, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" }
    });
  }
});
