import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
        }

          try {
              const { messages } = req.body || {};

                  if (!Array.isArray(messages) || messages.length === 0) {
                        return res.status(400).json({ error: "No messages provided" });
                            }

                                const ai = new GoogleGenAI({
                                      apiKey: process.env.GEMINI_API_KEY
                                          });

                                              const contents = messages.map((message) => ({
                                                    role: message.role === "assistant" ? "model" : "user",
                                                          parts: [{ text: String(message.content || "") }]
                                                              }));

                                                                  const response = await ai.models.generateContent({
                                                                        model: "gemini-3.8-flash",
                                                                              contents,
                                                                                    config: {
                                                                                            systemInstruction:
                                                                                                      "You are NovaAI, a helpful, friendly and intelligent AI assistant. Give clear, accurate and useful answers."
                                                                                                            }
                                                                                                                });

                                                                                                                    return res.status(200).json({
                                                                                                                          reply: response.text || "I couldn't generate a response."
                                                                                                                              });

                                                                                                                                } catch (error) {
                                                                                                                                    console.error(error);

                                                                                                                                        return res.status(500).json({
                                                                                                                                              error: "AI request failed."
                                                                                                                                                  });
                                                                                                                                                    }
                                                                                                                                                    }