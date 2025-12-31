// backend/utils/translator.js
import fetch from "node-fetch";

export const translateText = async (text, targetLang = "ar") => {
  if (!text) return "";
  try {
    const res = await fetch("http://localhost:5100/translate", {
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
    console.error("Translation Error:", err);
    return text; // fallback to original text
  }
};
