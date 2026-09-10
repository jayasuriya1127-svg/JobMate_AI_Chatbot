const API_URL = "http://127.0.0.1:5000/chat";
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type) {
  const row = document.createElement("div");
  row.className = `msg ${type}`;
  row.innerHTML = `<div class="avatar">${type === "user" ? "👤" : "🤖"}</div>
                   <div class="bubble"></div>`;
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
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message:text})
    });
    const data = await res.json();
    thinking.querySelector(".bubble").textContent =
      data.reply || data.error || "Sorry, I couldn't generate a response.";
  } catch (err) {
    thinking.querySelector(".bubble").textContent =
      "⚠️ Could not connect to JobMate. Make sure the Flask backend is running on port 5000.";
  } finally {
    sendBtn.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  sendMessage(input.value);
});

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-msg]");
  if (btn) sendMessage(btn.dataset.msg);
});
