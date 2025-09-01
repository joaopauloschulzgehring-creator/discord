// script.js
const socket = io("https://discord-clone-backend.onrender.com");

// avatars available in /avatars folder
const avatars = ["avatars/1.png", "avatars/2.png", "avatars/3.png", "avatars/4.png"];

// load username & avatar from localStorage or generate
let username = localStorage.getItem("username");
let myAvatar = localStorage.getItem("avatar");

if (!username) {
    username = "User" + Math.floor(Math.random() * 1000);
    myAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", myAvatar);
}

// notify backend of new user
socket.emit("join", { username, avatar: myAvatar });

// update online users
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

// send message
function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;
    if (message.trim() === "") return;

    socket.emit("chat message", { message, avatar: myAvatar, username });
    input.value = "";
}

// allow Enter key to send
document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// receive messages
socket.on("chat message", (data) => {
    const messages = document.getElementById("messages");
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = data.avatar;
    img.width = 40;
    img.height = 40;

    const span = document.createElement("span");
    span.textContent = `${data.username}: ${data.message}`;

    li.appendChild(img);
    li.appendChild(span);
    messages.appendChild(li);

    messages.scrollTop = messages.scrollHeight;
});

// create server simulation
function createServer() {
    const serverName = prompt("Enter server name:");
    if (!serverName) return;
    const ul = document.getElementById("servers");
    const li = document.createElement("li");
    li.textContent = serverName;
    ul.appendChild(li);
}
