// database.js
// Modul database SQLite untuk WhatsApp Super Bot
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'botdata.db'));

// Inisialisasi tabel jika belum ada
const initDB = () => {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      phone TEXT UNIQUE,
      name TEXT,
      level INTEGER DEFAULT 1,
      exp INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      last_active TEXT,
      join_date TEXT,
      total_messages INTEGER DEFAULT 0,
      achievements TEXT
    )`);

    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      group_id TEXT,
      user_phone TEXT,
      message TEXT,
      timestamp TEXT,
      message_type TEXT,
      sentiment REAL
    )`);

    // Games table
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      user_phone TEXT,
      game_type TEXT,
      score INTEGER,
      timestamp TEXT
    )`);

    // Reminders table
    db.run(`CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY,
      user_phone TEXT,
      group_id TEXT,
      reminder_text TEXT,
      reminder_time TEXT,
      is_sent INTEGER DEFAULT 0
    )`);

    // Analytics table
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY,
      group_id TEXT,
      date TEXT,
      total_messages INTEGER,
      active_users INTEGER,
      most_used_words TEXT
    )`);

    // Daily rewards table
    db.run(`CREATE TABLE IF NOT EXISTS daily_rewards (
      id INTEGER PRIMARY KEY,
      user_phone TEXT,
      date TEXT,
      points INTEGER,
      exp INTEGER,
      UNIQUE(user_phone, date)
    )`);

    // Polls table
    db.run(`CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY,
      poll_id TEXT UNIQUE,
      question TEXT,
      options TEXT,
      created_by TEXT,
      created_at TEXT,
      is_active INTEGER DEFAULT 1
    )`);

    // Poll votes table
    db.run(`CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY,
      poll_id TEXT,
      user_phone TEXT,
      choice INTEGER,
      voted_at TEXT,
      UNIQUE(poll_id, user_phone)
    )`);

    // Events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      event_id TEXT UNIQUE,
      title TEXT,
      datetime TEXT,
      location TEXT,
      created_by TEXT,
      created_at TEXT,
      is_active INTEGER DEFAULT 1
    )`);

    // Event RSVP table
    db.run(`CREATE TABLE IF NOT EXISTS event_rsvp (
      id INTEGER PRIMARY KEY,
      event_id TEXT,
      user_phone TEXT,
      response TEXT,
      rsvp_at TEXT,
      UNIQUE(event_id, user_phone)
    )`);

    // Habits table
    db.run(`CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY,
      user_phone TEXT,
      habit_name TEXT,
      created_at TEXT,
      is_active INTEGER DEFAULT 1
    )`);

    // Habit tracking table
    db.run(`CREATE TABLE IF NOT EXISTS habit_tracking (
      id INTEGER PRIMARY KEY,
      habit_id INTEGER,
      user_phone TEXT,
      completed_date TEXT,
      UNIQUE(habit_id, user_phone, completed_date)
    )`);

    // Expenses table
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY,
      user_phone TEXT,
      amount INTEGER,
      description TEXT,
      category TEXT,
      created_at TEXT
    )`);

    // Secret Santa table
    db.run(`CREATE TABLE IF NOT EXISTS secret_santa (
      id INTEGER PRIMARY KEY,
      event_id TEXT UNIQUE,
      title TEXT,
      budget INTEGER,
      deadline TEXT,
      created_by TEXT,
      created_at TEXT,
      is_active INTEGER DEFAULT 1
    )`);

    // Secret Santa participants table
    db.run(`CREATE TABLE IF NOT EXISTS secret_santa_participants (
      id INTEGER PRIMARY KEY,
      event_id TEXT,
      user_phone TEXT,
      assigned_to TEXT,
      joined_at TEXT,
      UNIQUE(event_id, user_phone)
    )`);

    // Bot settings table
    db.run(`CREATE TABLE IF NOT EXISTS bot_settings (
      id INTEGER PRIMARY KEY,
      setting_key TEXT UNIQUE,
      setting_value TEXT,
      updated_at TEXT
    )`);

    // Welcome/Goodbye messages table
    db.run(`CREATE TABLE IF NOT EXISTS group_messages (
      id INTEGER PRIMARY KEY,
      group_id TEXT,
      message_type TEXT,
      message_text TEXT,
      is_active INTEGER DEFAULT 1,
      updated_at TEXT
    )`);

    // Blocked words table
    db.run(`CREATE TABLE IF NOT EXISTS blocked_words (
      id INTEGER PRIMARY KEY,
      word TEXT UNIQUE,
      added_by TEXT,
      added_at TEXT
    )`);

    // Blocked links table
    db.run(`CREATE TABLE IF NOT EXISTS blocked_links (
      id INTEGER PRIMARY KEY,
      link TEXT UNIQUE,
      added_by TEXT,
      added_at TEXT
    )`);

    // Create indexes for better performance
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_phone)');
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)');
    db.run('CREATE INDEX IF NOT EXISTS idx_games_user ON games(user_phone)');
    db.run('CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(reminder_time)');
    db.run('CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date)');
    db.run('CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_date ON daily_rewards(user_phone, date)');
    db.run('CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_event_rsvp_event ON event_rsvp(event_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_habit_tracking_habit ON habit_tracking(habit_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_phone)');
    db.run('CREATE INDEX IF NOT EXISTS idx_secret_santa_participants_event ON secret_santa_participants(event_id)');

    console.log('✅ Database initialized successfully');
  });
};

// Initialize database
initDB();

module.exports = db; 