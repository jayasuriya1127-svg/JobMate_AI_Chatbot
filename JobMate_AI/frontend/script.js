const API_URL = "https://jobmate-ai-chatbot.onrender.com/chat";

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type) {
  const row = document.createElement("div");
  row.className = `msg ${type}`;

  row.innerHTML = `
    <div class="avatar">
      ${type === "user" ? "👤" : "🤖"}
    </div>
    <div class="bubble"></div>
  `;

  row.querySelector(".bubble").textContent = text;

  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(text) {
  text = text.trim();

  if (!text) return;

  document.querySelector(".welcome")?.remove();

  addMessage(text, "user");

  input.value = "";
  sendBtn.disabled = true;

  addMessage("Thinking...", "bot");

  const thinking = messages.lastElementChild;

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server error");
    }

    thinking.querySelector(".bubble").textContent =
      data.reply || "Sorry, I couldn't generate a response.";

  } catch (error) {

    console.error("JobMate Error:", error);

    thinking.querySelector(".bubble").textContent =
      "⚠️ Unable to connect to JobMate AI. Please try again.";

  } finally {

    sendBtn.disabled = false;
    input.focus();

    messages.scrollTop = messages.scrollHeight;
  }
}


// Send message
form.addEventListener("submit", function (event) {

  event.preventDefault();

  sendMessage(input.value);

});


// Quick suggestion buttons
document.addEventListener("click", function (event) {

  const button = event.target.closest("[data-msg]");

  if (button) {

    const message = button.getAttribute("data-msg");

    sendMessage(message);

  }

});
