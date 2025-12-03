const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000; // Dynamic port for deployment

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Real-time chat
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Chattingz running on port ${PORT}`);
});
const mongoose = require('mongoose');
mongoose.connect('YOUR_MONGODB_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
const session = require('express-session');

app.use(session({
  secret: 'chattingz-secret-key',
  resave: false,
  saveUninitialized: true
}));
const bcrypt = require('bcrypt');
const User = require('./models/User');

app.use(express.json()); // for parsing JSON body

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered!');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});
// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User not found');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send('Incorrect password');
  req.session.userId = user._id;
  res.send('Logged in!');
});

