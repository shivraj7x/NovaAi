import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
        }

          try {
              if (!process.env.GEMINI_API_KEY) {
                    return res.status(500).json({
                            error: "GEMINI_API_KEY is missing in Vercel."
                                  });
                                      }

                                          const { messages } = req.body || {};

                                              if (!Array.isArray(messages) || messages.length === 0) {
                                                    return res.status(400).json({ error: "No messages provided." });
                                                        }

                                                            const ai = new GoogleGenAI({
                                                                  apiKey: process.env.GEMINI_API_KEY
                                                                      });

                                                                          const contents = messages
                                                                                .filter(m => m && m.content)
                                                                                      .map(m => ({
                                                                                              role: m.role === "assistant" ? "model" : "user",
                                                                                                      parts: [{ text: String(m.content) }]
                                                                                                            }));

                                                                                                                const response = await ai.models.generateContent({
                                                                                                                      model: "gemini-3.8-flash",
                                                                                                                            contents,
                                                                                                                                  config: {
                                                                                                                                          systemInstruction:
                                                                                                                                                    "You are NovaAI, a helpful, accurate and friendly AI assistant. Explain things clearly and step by step when useful."
                                                                                                                                                          }
                                                                                                                                                              });

                                                                                                                                                                  return res.status(200).json({
                                                                                                                                                                        reply: response.text || "I couldn't generate a response."
                                                                                                                                                                            });

                                                                                                                                                                              } catch (error) {
                                                                                                                                                                                  console.error("NovaAI error:", error);

                                                                                                                                                                                      return res.status(500).json({
                                                                                                                                                                                            error: "NovaAI could not generate a response."
                                                                                                                                                                                                });
                                                                                                                                                                                                  }
                                                                                                                                                                                                  }