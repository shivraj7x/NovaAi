const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let messages = JSON.parse(
  localStorage.getItem("nova_messages") || "[]"
  );

  function saveMessages() {
    localStorage.setItem("nova_messages", JSON.stringify(messages));
    }

    function addMessage(text, role) {
      const div = document.createElement("div");
        div.className = `message ${role}`;
          div.textContent = text;
            chat.appendChild(div);
              chat.scrollTop = chat.scrollHeight;
                return div;
                }

                function renderMessages() {
                  chat.innerHTML = "";

                    if (!messages.length) {
                        addMessage(
                              "Hi! I'm NovaAI. How can I help you?",
                                    "assistant"
                                        );
                                            return;
                                              }

                                                messages.forEach(message => {
                                                    addMessage(message.content, message.role);
                                                      });
                                                      }

                                                      async function sendMessage() {
                                                        const text = input.value.trim();

                                                          if (!text || sendBtn.disabled) return;

                                                            input.value = "";
                                                              sendBtn.disabled = true;

                                                                messages.push({
                                                                    role: "user",
                                                                        content: text
                                                                          });

                                                                            addMessage(text, "user");
                                                                              saveMessages();

                                                                                const thinking = addMessage("Thinking...", "assistant");

                                                                                  try {
                                                                                      const response = await fetch("/api/chat", {
                                                                                            method: "POST",
                                                                                                  headers: {
                                                                                                          "Content-Type": "application/json"
                                                                                                                },
                                                                                                                      body: JSON.stringify({ messages })
                                                                                                                          });

                                                                                                                              const raw = await response.text();

                                                                                                                                  thinking.remove();

                                                                                                                                      let data;

                                                                                                                                          try {
                                                                                                                                                data = JSON.parse(raw);
                                                                                                                                                    } catch {
                                                                                                                                                          throw new Error(
                                                                                                                                                                  `Server returned ${response.status}: ${raw}`
                                                                                                                                                                        );
                                                                                                                                                                            }

                                                                                                                                                                                if (!response.ok) {
                                                                                                                                                                                      throw new Error(
                                                                                                                                                                                              data.error || `Server returned ${response.status}`
                                                                                                                                                                                                    );
                                                                                                                                                                                                        }

                                                                                                                                                                                                            messages.push({
                                                                                                                                                                                                                  role: "assistant",
                                                                                                                                                                                                                        content: data.reply
                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                addMessage(data.reply, "assistant");
                                                                                                                                                                                                                                    saveMessages();

                                                                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                                                                          thinking.remove();

                                                                                                                                                                                                                                              addMessage(
                                                                                                                                                                                                                                                    "AI error: " + error.message,
                                                                                                                                                                                                                                                          "assistant"
                                                                                                                                                                                                                                                              );

                                                                                                                                                                                                                                                                  console.error(error);

                                                                                                                                                                                                                                                                    } finally {
                                                                                                                                                                                                                                                                        sendBtn.disabled = false;
                                                                                                                                                                                                                                                                            input.focus();
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                              sendBtn.addEventListener("click", sendMessage);

                                                                                                                                                                                                                                                                              input.addEventListener("keydown", event => {
                                                                                                                                                                                                                                                                                if (event.key === "Enter" && !event.shiftKey) {
                                                                                                                                                                                                                                                                                    event.preventDefault();
                                                                                                                                                                                                                                                                                        sendMessage();
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                                                          renderMessages();