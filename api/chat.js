import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
        }

          try {
              const apiKey = process.env.GEMINI_API_KEY;

                  if (!apiKey) {
                        return res.status(500).json({
                                error: "GEMINI_API_KEY is missing from Vercel."
                                      });
                                          }

                                              const { messages } = req.body || {};

                                                  if (!Array.isArray(messages) || messages.length === 0) {
                                                        return res.status(400).json({
                                                                error: "No messages were received."
                                                                      });
                                                                          }

                                                                              const ai = new GoogleGenAI({
                                                                                    apiKey: apiKey
                                                                                        });

                                                                                            const contents = messages
                                                                                                  .filter(message => message && message.content)
                                                                                                        .map(message => ({
                                                                                                                role: message.role === "assistant" ? "model" : "user",
                                                                                                                        parts: [
                                                                                                                                  {
                                                                                                                                              text: String(message.content)
                                                                                                                                                        }
                                                                                                                                                                ]
                                                                                                                                                                      }));

                                                                                                                                                                          const response = await ai.models.generateContent({
                                                                                                                                                                                model: "gemini-2.5-flash",
                                                                                                                                                                                      contents: contents,
                                                                                                                                                                                            config: {
                                                                                                                                                                                                    systemInstruction:
                                                                                                                                                                                                              "You are NovaAI, a helpful, accurate and friendly AI assistant. Give clear answers and explain things step by step when useful."
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                        });

                                                                                                                                                                                                                            const reply = response.text;

                                                                                                                                                                                                                                if (!reply) {
                                                                                                                                                                                                                                      return res.status(500).json({
                                                                                                                                                                                                                                              error: "Gemini returned an empty response."
                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                            return res.status(200).json({
                                                                                                                                                                                                                                                                  reply: reply
                                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                                        } catch (error) {
                                                                                                                                                                                                                                                                            console.error("NovaAI Gemini error:", error);

                                                                                                                                                                                                                                                                                return res.status(500).json({
                                                                                                                                                                                                                                                                                      error: error?.message || "Gemini request failed."
                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                            }