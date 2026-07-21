const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'admin.db'), (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
const initDb = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'editor',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Blog posts table
    db.run(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        featured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        publishedAt DATETIME
      )
    `);

    // Website status/metrics table
    db.run(`
      CREATE TABLE IF NOT EXISTS website_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bug reports table
    db.run(`
      CREATE TABLE IF NOT EXISTS bug_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'open',
        reportedBy TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user
    const hashedPassword = bcryptjs.hashSync('admin123', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
      ['admin', hashedPassword, 'admin@shavegibson.com', 'admin']
    );

    console.log('Database tables initialized');
  });
};

initDb();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  });
});

app.post('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// BLOG ROUTES
app.get('/api/blog/posts', (req, res) => {
  const status = req.query.status || 'published';

  if (status === 'all') {
    db.all(
      `SELECT * FROM blog_posts ORDER BY createdAt DESC LIMIT 50`,
      (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(posts);
      }
    );
  } else {
    db.all(
      `SELECT * FROM blog_posts WHERE status = ? ORDER BY createdAt DESC LIMIT 50`,
      [status],
      (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(posts);
      }
    );
  }
});

app.get('/api/blog/posts/:id', (req, res) => {
  db.get('SELECT * FROM blog_posts WHERE id = ?', [req.params.id], (err, post) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  });
});

app.post('/api/blog/posts', verifyToken, (req, res) => {
  const { title, content, excerpt, featured } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  db.run(
    `INSERT INTO blog_posts (title, slug, content, excerpt, author, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, content, excerpt || '', req.user.username, 'draft', featured ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Post created' });
    }
  );
});

app.put('/api/blog/posts/:id', verifyToken, (req, res) => {
  const { title, content, excerpt, status, featured } = req.body;

  db.run(
    `UPDATE blog_posts SET title = ?, content = ?, excerpt = ?, status = ?, featured = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    [title, content, excerpt || '', status, featured ? 1 : 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Post updated' });
    }
  );
});

app.delete('/api/blog/posts/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM blog_posts WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post deleted' });
  });
});

// WEBSITE STATUS ROUTES
app.get('/api/status', (req, res) => {
  db.all('SELECT * FROM website_status', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const status = {};
    rows.forEach((row) => {
      status[row.key] = row.value;
    });
    res.json(status);
  });
});

app.put('/api/status/:key', verifyToken, (req, res) => {
  const { value } = req.body;
  db.run(
    `INSERT OR REPLACE INTO website_status (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [req.params.key, value],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status updated' });
    }
  );
});

// BUG REPORT ROUTES
app.get('/api/bugs', verifyToken, (req, res) => {
  const status = req.query.status;

  let query = 'SELECT * FROM bug_reports';
  let params = [];

  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY createdAt DESC LIMIT 50';

  db.all(query, params, (err, bugs) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bugs);
  });
});

app.post('/api/bugs', verifyToken, (req, res) => {
  const { title, description, severity } = req.body;

  db.run(
    `INSERT INTO bug_reports (title, description, severity, reportedBy) VALUES (?, ?, ?, ?)`,
    [title, description, severity || 'medium', req.user.username],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Bug reported' });
    }
  );
});

app.put('/api/bugs/:id', verifyToken, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE bug_reports SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Bug updated' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin Portal Backend running on http://localhost:${PORT}`);
});
