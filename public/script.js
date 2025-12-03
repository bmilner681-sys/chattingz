const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>User:</strong> ${msg}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});
document.getElementById('register-btn').addEventListener('click', async () => {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  alert('Registered!');
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const text = await res.text();
  alert(text);
});
const authDiv = document.getElementById('auth');
const chatDiv = document.getElementById('chat-container');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in on page load
async function checkLogin() {
  const res = await fetch('/me');
  const data = await res.json();
  if (data.loggedIn) {
    authDiv.style.display = 'none';
    chatDiv.style.display = 'block';
    username = data.username;
    avatar = data.avatar;
  }
}
checkLogin();

// Logout button
logoutBtn.addEventListener('click', async () => {
  await fetch('/logout', { method: 'POST' });
  authDiv.style.display = 'block';
  chatDiv.style.display = 'none';
  messages.innerHTML = '';
});
