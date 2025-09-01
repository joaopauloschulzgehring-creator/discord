document.addEventListener("DOMContentLoaded", () => {
  const avatars = ["avatars/1.png","avatars/2.png","avatars/3.png","avatars/4.png"];

  let username = localStorage.getItem("username");
  let myAvatar = localStorage.getItem("avatar");

  if (!username) {
    username = "User" + Math.floor(Math.random() * 1000);
    myAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", myAvatar);
  }

  const socket = io("https://discord-clone-backend.onrender.com");

  socket.emit("join", { username, avatar: myAvatar });

  socket.on("online users", (users) => {
    const ul = document.getElementById("onlineUsers");
    ul.innerHTML = "";
    users.forEach(u => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.src = u.avatar;
      li.appendChild(img);
      li.appendChild(document.createTextNode(u.username));
      ul.appendChild(li);
    });
  });

  socket.on("chat message", (data) => {
    const messages = document.getElementById("messages");
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = data.avatar;
    img.width = 40; img.height = 40;
    const span = document.createElement("span");
    span.textContent = `${data.username}: ${data.message}`;
    li.appendChild(img);
    li.appendChild(span);
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });

  window.sendMessage = function() {
    const input = document.getElementById("messageInput");
    const message = input.value;
    if (message.trim() === "") return;
    socket.emit("chat message", { message, avatar: myAvatar, username });
    input.value = "";
  };

  document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  window.createServer = function() {
    const serverName = prompt("Enter server name:");
    if (!serverName) return;
    const ul = document.getElementById("servers");
    const li = document.createElement("li");
    li.textContent = serverName;
    ul.appendChild(li);
  };
});
