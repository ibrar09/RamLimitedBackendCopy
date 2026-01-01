// backend/utils/translator.js
import fetch from "node-fetch";

export const translateText = async (text, targetLang = "ar") => {
  if (!text) return "";
  try {
    const translateUrl = process.env.LIBRETRANSLATE_URL || "http://localhost:5100";
    const res = await fetch(`${translateUrl}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });
    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.warn("⚠️ [Translator] Service offline. Skipping translation.");
    } else {
      console.error("Translation Error:", err.message);
    }
    return text; // fallback to original text
  }
};
