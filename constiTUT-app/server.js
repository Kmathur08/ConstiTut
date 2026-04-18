const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE_USERS_FILE = path.join(__dirname, 'users.json');
const USERS_FILE = process.env.VERCEL ? path.join('/tmp', 'users.json') : SOURCE_USERS_FILE;
const SESSION_SECRET = process.env.SESSION_SECRET || 'constitut-secret';
const RESET_TOKEN_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, sameSite: 'lax' }
}));

const PUBLIC_PATHS = [
  '/signup.html',
  '/reset-password.html',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/logout',
  '/api/auth/session'
];

app.use((req, res, next) => {
  if (req.path.startsWith('/assets') || req.path.startsWith('/api/auth') || PUBLIC_PATHS.includes(req.path)) {
    return next();
  }

  if (req.path.startsWith('/api/')) {
    if (!getAuthenticatedUsername(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
  }

  if (!getAuthenticatedUsername(req)) {
    return res.redirect('/signup.html');
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function parseCookies(cookieHeader) {
  return (cookieHeader || '').split(';').reduce((cookies, item) => {
    const separatorIndex = item.indexOf('=');
    if (separatorIndex === -1) {
      return cookies;
    }

    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();
    if (key) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {});
}

function createAuthToken(username) {
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(username).digest('hex');
  return `${username}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const lastDotIndex = token.lastIndexOf('.');
  const username = token.slice(0, lastDotIndex);
  const signature = token.slice(lastDotIndex + 1);
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(username).digest('hex');

  if (signature !== expectedSignature) {
    return null;
  }

  return username;
}

function getAuthenticatedUsername(req) {
  if (req.session && req.session.user && req.session.user.username) {
    return req.session.user.username;
  }

  const cookies = parseCookies(req.headers.cookie);
  return verifyAuthToken(cookies.authToken);
}

function setAuthCookie(res, username) {
  const cookieParts = [
    `authToken=${encodeURIComponent(createAuthToken(username))}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=86400'
  ];

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearAuthCookie(res) {
  const cookieParts = [
    'authToken=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

async function ensureUsersFile() {
  if (!process.env.VERCEL) {
    return;
  }

  try {
    await fs.access(USERS_FILE);
  } catch {
    try {
      const data = await fs.readFile(SOURCE_USERS_FILE, 'utf8');
      await fs.writeFile(USERS_FILE, data || '{}', 'utf8');
    } catch {
      await fs.writeFile(USERS_FILE, '{}', 'utf8');
    }
  }
}

async function loadUsers() {
  await ensureUsersFile();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return data.trim() ? JSON.parse(data) : {};
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

async function saveUsers(users) {
  await ensureUsersFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function findUserByEmail(users, email) {
  return Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase());
}

function createResetToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function sendPasswordResetEmail(to, resetUrl) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@constitut.app',
    to,
    subject: 'ConstiTUT Password Reset',
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`
  };

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return transporter.sendMail(mailOptions);
  }

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail(mailOptions);
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  return info;
}

function formatDateISO(date) {
  return date.toISOString().slice(0, 10);
}

function getDateSet(history) {
  return new Set((history || []).map(date => date.slice(0, 10)));
}

function getCurrentStreak(loginHistory) {
  const dateSet = getDateSet(loginHistory);
  let streak = 0;
  let day = new Date();
  while (true) {
    const dayKey = formatDateISO(day);
    if (dateSet.has(dayKey)) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getYearHeatmap(year, loginHistory) {
  const loginSet = getDateSet(loginHistory);
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  const heatmap = [];
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const dateString = formatDateISO(day);
    heatmap.push({ date: dateString, active: loginSet.has(dateString) });
  }
  return heatmap;
}

// Authentication routes
app.post('/api/auth/signup', asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await loadUsers();

  if (users[username]) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  if (findUserByEmail(users, email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users[username] = {
    name,
    username,
    email,
    passwordHash,
    resetToken: null,
    resetTokenExpiry: null,
    loginHistory: []
  };

  await saveUsers(users);
  res.json({ message: 'Signup successful' });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const identifier = String(username || '').trim();

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  const users = await loadUsers();
  const user = users[identifier] || findUserByEmail(users, identifier);

  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const today = formatDateISO(new Date());
  user.loginHistory = user.loginHistory || [];
  if (user.loginHistory[user.loginHistory.length - 1] !== today) {
    user.loginHistory.push(today);
    await saveUsers(users);
  }

  req.session.user = {
    username: user.username,
    name: user.name,
    email: user.email
  };

  setAuthCookie(res, user.username);

  res.json({ message: 'Login successful' });
}));

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    clearAuthCookie(res);
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/auth/session', asyncHandler(async (req, res) => {
  const username = getAuthenticatedUsername(req);
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.session && req.session.user && req.session.user.username === username) {
    return res.json({ user: req.session.user });
  }

  const users = await loadUsers();
  const user = users[username];
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({
    user: {
      username: user.username,
      name: user.name,
      email: user.email
    }
  });
}));

app.get('/api/auth/profile', asyncHandler(async (req, res) => {
  const username = getAuthenticatedUsername(req);

  if (!username) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const users = await loadUsers();
  const user = users[username];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const loginHistory = user.loginHistory || [];
  const currentYear = new Date().getFullYear();
  const heatmap = getYearHeatmap(currentYear, loginHistory);
  const streak = getCurrentStreak(loginHistory);

  res.json({
    user: {
      username: user.username,
      name: user.name,
      email: user.email
    },
    loginHistory,
    heatmap,
    currentYear,
    streak,
    totalLogins: loginHistory.length
  });
}));

app.post('/api/auth/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const users = await loadUsers();
  const user = findUserByEmail(users, email);

  if (!user) {
    return res.status(400).json({ error: 'No account found with that email' });
  }

  const resetToken = createResetToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + RESET_TOKEN_EXPIRY_MS;
  await saveUsers(users);

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;
  await sendPasswordResetEmail(email, resetUrl);

  res.json({ message: 'Password reset link sent to your email' });
}));

app.post('/api/auth/reset-password', asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  const users = await loadUsers();
  const user = Object.values(users).find(
    userRecord => userRecord.resetToken === token && userRecord.resetTokenExpiry > Date.now()
  );

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await saveUsers(users);

  res.json({ message: 'Password reset successful' });
}));

const constitutionContent = [
  {
    heading: "Election of the President of India",
    content: [
      {
        id: 1,
    
        content: [
          "The President is elected by an Electoral College comprising:",
          "Elected members of both Houses of Parliament.",
          "Elected members of the Legislative Assemblies of States and Union Territories."
        ]
      },
      {
        id: 2,
        title: "Proportional Representation",
        content: [
          "The election uses a proportional representation system by means of a single transferable vote.",
          "This method ensures a wide consensus in the election process."
        ]
      },
      {
        id: 3,
        title: "Voting Process",
        content: [
          "Members of the Electoral College cast their votes, which are then counted, and the candidate securing the required quota is declared elected.",
          "This method ensures a wide consensus in the election process."
        ]
      }
    ]
  },
  {
    heading: "Role and Powers of President",
    content: [
      {
        id: 1,
        title: "Executive Head of Union",
        content: [
          "The President is the nominal head of the executive.",
          "The real executive powers are exercised by the Prime Minister and the Council of Ministers.",
          "The President acts as the symbolic leader of the country and must perform all executive actions in accordance with the aid and advice of the Council of Ministers."
        ]
      },
      {
        id: 2,
        title: "Legislative Role",
        content: [
          "The President summons and prorogues sessions of Parliament.",
          "He can dissolve the Lok Sabha before the expiry of its term.",
          "The President addresses the first session of Parliament after each general election."
        ]
      },
      {
        id: 3,
        title: "Judicial and Emergency Powers",
        content: [
          "The President appoints judges of the Supreme Court and High Courts.",
          "He has the power to grant pardons and reprieves.",
          "He can declare national, state, or financial emergencies under Articles 352, 356, and 360 of the Constitution."
        ]
      }
    ]
  }
];

const quizData = [
  {
    question: "Who is the head of the Union Executive under Part 5 of the Constitution?",
    options: ["The President", "The Prime Minister", "The Vice President", "The Chief Justice"],
    correctAnswer: "The President"
  },
  {
    question: "Which article under Part 5 of the Constitution deals with the President's election?",
    options: ["Article 52", "Article 54", "Article 56", "Article 58"],
    correctAnswer: "Article 54"
  },
  {
    question: "Under Part 5, what is the minimum age required for a candidate to be elected as the President of India?",
    options: ["25 years", "30 years", "35 years", "40 years"],
    correctAnswer: "35 years"
  },
  {
    question: "Which part of the Constitution mentions the powers and functions of the Vice President of India?",
    options: ["Part 5", "Part 6", "Part 7", "Part 8"],
    correctAnswer: "Part 5"
  },
  {
    question: "What is the term of office for the President of India under Part 5 of the Constitution?",
    options: ["4 years", "5 years", "6 years", "7 years"],
    correctAnswer: "5 years"
  },
  {
    question: "Under Part 5, which Article provides for the removal of the President through impeachment?",
    options: ["Article 61", "Article 62", "Article 63", "Article 64"],
    correctAnswer: "Article 61"
  },
  {
    question: "Which part of the Constitution deals with the Parliament?",
    options: ["Part 3", "Part 4", "Part 5", "Part 6"],
    correctAnswer: "Part 5"
  },
  {
    question: "Under Part 5, the Parliament consists of which of the following?",
    options: [
      "Lok Sabha and Rajya Sabha",
      "Lok Sabha and the President",
      "Rajya Sabha and the President",
      "Lok Sabha, Rajya Sabha, and the President"
    ],
    correctAnswer: "Lok Sabha, Rajya Sabha, and the President"
  },
  {
    question: "Which Article under Part 5 gives the Parliament the power to make laws?",
    options: ["Article 79", "Article 80", "Article 81", "Article 82"],
    correctAnswer: "Article 79"
  },
  {
    question: "What is the maximum number of members allowed in the Lok Sabha as per Part 5 of the Constitution?",
    options: ["530", "545", "552", "560"],
    correctAnswer: "552"
  },
  {
    question: "Under Part 5, how many members of the Rajya Sabha are nominated by the President?",
    options: ["10", "12", "15", "18"],
    correctAnswer: "12"
  },
  {
    question: "Which article under Part 5 empowers the Parliament to regulate the right to freedom of trade, commerce, and intercourse?",
    options: ["Article 301", "Article 302", "Article 303", "Article 304"],
    correctAnswer: "Article 302"
  },
  {
    question: "Which part of the Constitution outlines the structure and function of the State Legislatures?",
    options: ["Part 4", "Part 5", "Part 6", "Part 7"],
    correctAnswer: "Part 6"
  },
  {
    question: "Who is the head of the State Executive under Part 6 of the Constitution?",
    options: ["The Chief Minister", "The Governor", "The Chief Justice", "The Speaker"],
    correctAnswer: "The Governor"
  },
  {
    question: "Under Part 6, who appoints the Governor of a State?",
    options: ["The President", "The Prime Minister", "The Chief Minister", "The Chief Justice"],
    correctAnswer: "The President"
  },
  {
    question: "What is the minimum age required to be appointed as a Governor under Part 6 of the Constitution?",
    options: ["25 years", "30 years", "35 years", "40 years"],
    correctAnswer: "35 years"
  },
  {
    question: "Which article under Part 6 deals with the State Legislature's composition?",
    options: ["Article 168", "Article 169", "Article 170", "Article 171"],
    correctAnswer: "Article 168"
  },
  {
    question: "What is the term of office for the Governor as provided under Part 6?",
    options: ["4 years", "5 years", "6 years", "7 years"],
    correctAnswer: "5 years"
  },
  {
    question: "Which part of the Constitution gives the Governor the power to promulgate ordinances during recess of the State Legislature?",
    options: ["Part 4", "Part 5", "Part 6", "Part 7"],
    correctAnswer: "Part 6"
  },
  {
    question: "Under Part 6, which article provides the power of the Governor to summon, prorogue, and dissolve the State Legislative Assembly?",
    options: ["Article 174", "Article 175", "Article 176", "Article 177"],
    correctAnswer: "Article 174"
  }
];

const videoData = require('./videoData');

// API Routes
const normalizeHeading = heading => heading.toLowerCase().replace(/-/g, ' ').trim();

app.get('/api/videos', (req, res) => {
  const videos = Object.entries(videoData).map(([title, video_url]) => ({
    title,
    video_url
  }));
  res.json(videos);
});

app.get('/api/videos/:title', (req, res) => {
  const requestedTitle = normalizeHeading(req.params.title);
  const matchedTitle = Object.keys(videoData).find(videoTitle =>
    normalizeHeading(videoTitle) === requestedTitle
  );

  if (matchedTitle) {
    res.json({ title: matchedTitle, video_url: videoData[matchedTitle] });
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

app.get('/api/left', (req, res) => {
  res.json(leftside);
});

app.get('/api/quiz', (req, res) => {
  res.json(quizData);
});

app.get('/api/content', (req, res) => {
  res.json(constitutionContent);
});

app.get('/api/content/:heading', (req, res) => {
  const requestedHeading = normalizeHeading(req.params.heading);
  const content = constitutionContent.find(item =>
    normalizeHeading(item.heading) === requestedHeading
  );

  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ error: 'Content not found' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (only for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ConstiTUT server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;