export default async function handler(req, res) {
      if (req.method !== "POST") {
          return res.status(405).json({
                error: "Method not allowed"
                    });
                      }

                        try {
                            const apiKey = process.env.GEMINI_API_KEY;

                                if (!apiKey) {
                                      return res.status(500).json({
                                              error: "GEMINI_API_KEY is missing in Vercel."
                                                    });
                                                        }

                                                            const { messages } = req.body || {};

                                                                if (!Array.isArray(messages) || messages.length === 0) {
                                                                      return res.status(400).json({
                                                                              error: "No messages received."
                                                                                    });
                                                                                        }

                                                                                            const contents = messages
                                                                                                  .filter(m =>
                                                                                                          m &&
                                                                                                                  m.content &&
                                                                                                                          (m.role === "user" || m.role === "assistant" || m.role === "model")
                                                                                                                                )
                                                                                                                                      .map(m => ({
                                                                                                                                              role: m.role === "assistant" ? "model" : "user",
                                                                                                                                                      parts: [
                                                                                                                                                                {
                                                                                                                                                                            text: String(m.content)
                                                                                                                                                                                      }
                                                                                                                                                                                              ]
                                                                                                                                                                                                    }));

                                                                                                                                                                                                        const geminiResponse = await fetch(
                                                                                                                                                                                                              "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                            method: "POST",
                                                                                                                                                                                                                                    headers: {
                                                                                                                                                                                                                                              "Content-Type": "application/json",
                                                                                                                                                                                                                                                        "x-goog-api-key": apiKey
                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                        body: JSON.stringify({
                                                                                                                                                                                                                                                                                  contents
                                                                                                                                                                                                                                                                                          })
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                    );

                                                                                                                                                                                                                                                                                                        const data = await geminiResponse.json();

                                                                                                                                                                                                                                                                                                            if (!geminiResponse.ok) {
                                                                                                                                                                                                                                                                                                                  return res.status(geminiResponse.status).json({
                                                                                                                                                                                                                                                                                                                          error:
                                                                                                                                                                                                                                                                                                                                    data?.error?.message ||
                                                                                                                                                                                                                                                                                                                                              "Gemini API request failed."
                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                            const reply =
                                                                                                                                                                                                                                                                                                                                                                  data?.candidates?.[0]?.content?.parts?.[0]?.text;

                                                                                                                                                                                                                                                                                                                                                                      if (!reply) {
                                                                                                                                                                                                                                                                                                                                                                            return res.status(500).json({
                                                                                                                                                                                                                                                                                                                                                                                    error: "Gemini returned no text response."
                                                                                                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                                                                                                  return res.status(200).json({
                                                                                                                                                                                                                                                                                                                                                                                                        reply
                                                                                                                                                                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                                                                                                                                                              } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                                                  console.error("NovaAI server error:", error);

                                                                                                                                                                                                                                                                                                                                                                                                                      return res.status(500).json({
                                                                                                                                                                                                                                                                                                                                                                                                                            error: error?.message || "NovaAI server error."
                                                                                                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                                                                                  }
}