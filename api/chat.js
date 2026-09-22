import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
        }

          try {
              const key = process.env.GEMINI_API_KEY;

                  if (!key) {
                        return res.status(500).json({
                                error: "GEMINI_API_KEY is missing."
                                      });
                                          }

                                              const { messages } = req.body || {};

                                                  if (!Array.isArray(messages) || !messages.length) {
                                                        return res.status(400).json({
                                                                error: "No messages received."
                                                                      });
                                                                          }

                                                                              const ai = new GoogleGenAI({ apiKey: key });

                                                                                  const contents = messages
                                                                                        .filter(m => m && m.content)
                                                                                              .map(m => ({
                                                                                                      role: m.role === "assistant" ? "model" : "user",
                                                                                                              parts: [{ text: String(m.content) }]
                                                                                                                    }));

                                                                                                                        const result = await ai.models.generateContent({
                                                                                                                              model: "gemini-3.8-flash",
                                                                                                                                    contents,
                                                                                                                                          config: {
                                                                                                                                                  systemInstruction:
                                                                                                                                                            "You are NovaAI, a helpful, accurate and friendly AI assistant."
                                                                                                                                                                  }
                                                                                                                                                                      });

                                                                                                                                                                          return res.status(200).json({
                                                                                                                                                                                reply: result.text || "No response was generated."
                                                                                                                                                                                    });

                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                          console.error("NovaAI:", error);

                                                                                                                                                                                              return res.status(500).json({
                                                                                                                                                                                                    error: error?.message || "Gemini request failed."
                                                                                                                                                                                                        });
                                                                                                                                                                                                          }
                                                                                                                                                                                                          }