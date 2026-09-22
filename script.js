const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let messages = JSON.parse(localStorage.getItem("nova_messages") || "[]");

function saveMessages() {
  localStorage.setItem("nova_messages", JSON.stringify(messages));
  }

  function addMessage(text, role) {
    const div = document.createElement("div");
      div.className = `message ${role}`;
        div.textContent = text;
          chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
            }

            function renderMessages() {
              chat.innerHTML = "";

                if (!messages.length) {
                    addMessage("Hi! I'm NovaAI. How can I help you?", "assistant");
                        return;
                          }

                            messages.forEach(m => addMessage(m.content, m.role));
                            }

                            async function sendMessage() {
                              const text = input.value.trim();

                                if (!text) return;

                                  input.value = "";
                                    sendBtn.disabled = true;

                                      messages.push({
                                          role: "user",
                                              content: text
                                                });

                                                  addMessage(text, "user");
                                                    saveMessages();

                                                      const thinking = document.createElement("div");
                                                        thinking.className = "message assistant";
                                                          thinking.textContent = "Thinking...";
                                                            chat.appendChild(thinking);
                                                              chat.scrollTop = chat.scrollHeight;

                                                                try {
                                                                    const response = await fetch("/api/chat", {
                                                                          method: "POST",
                                                                                headers: {
                                                                                        "Content-Type": "application/json"
                                                                                              },
                                                                                                    body: JSON.stringify({
                                                                                                            messages: messages
                                                                                                                  })
                                                                                                                      });

                                                                                                                          const data = await response.json();

                                                                                                                              thinking.remove();

                                                                                                                                  if (!response.ok) {
                                                                                                                                        throw new Error(data.error || "AI request failed");
                                                                                                                                            }

                                                                                                                                                messages.push({
                                                                                                                                                      role: "assistant",
                                                                                                                                                            content: data.reply
                                                                                                                                                                });

                                                                                                                                                                    addMessage(data.reply, "assistant");
                                                                                                                                                                        saveMessages();

                                                                                                                                                                          } catch (error) {
                                                                                                                                                                              thinking.remove();

                                                                                                                                                                                  const errorMessage =
                                                                                                                                                                                        "Sorry, NovaAI couldn't connect to the AI server.";

                                                                                                                                                                                            addMessage(errorMessage, "assistant");
                                                                                                                                                                                                console.error(error);
                                                                                                                                                                                                  }

                                                                                                                                                                                                    sendBtn.disabled = false;
                                                                                                                                                                                                      input.focus();
                                                                                                                                                                                                      }

                                                                                                                                                                                                      sendBtn.addEventListener("click", sendMessage);

                                                                                                                                                                                                      input.addEventListener("keydown", event => {
                                                                                                                                                                                                        if (event.key === "Enter" && !event.shiftKey) {
                                                                                                                                                                                                            event.preventDefault();
                                                                                                                                                                                                                sendMessage();
                                                                                                                                                                                                                  }
                                                                                                                                                                                                                  });

                                                                                                                                                                                                                  renderMessages();