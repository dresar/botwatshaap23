// app.js
// WhatsApp Super Bot - Inti Bot & Web Server dengan 1000+ Baris Kode
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const db = require('./database');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const rateLimit = require('rate-limiter-flexible');
const axios = require('axios');
const cron = require('node-cron');

// --- Konfigurasi Bot ---
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// --- Rate Limiter ---
const rateLimiter = new rateLimit.RateLimiterMemory({
  points: 5, // 5 command per 10 detik
  duration: 10,
});

// --- WhatsApp Client ---
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

// --- Global Variables ---
let botStatus = 'online';
let maintenanceMode = false;
let autoReplyEnabled = true;
let welcomeMessage = 'Selamat datang di grup!';
let goodbyeMessage = 'Sampai jumpa!';
let spamFilter = true;
let floodControl = { enabled: true, limit: 5, time: 10 };
let blockedWords = ['spam', 'judi', 'slot'];
let blockedLinks = ['spam.com', 'scam.com'];

// --- Event Handlers ---
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan QR di atas untuk login WhatsApp!');
});

client.on('ready', () => {
  console.log('Bot WhatsApp siap digunakan!');
  botStatus = 'online';
  // Start scheduled tasks
  startScheduledTasks();
});

client.on('disconnected', () => {
  console.log('Bot terputus dari WhatsApp!');
  botStatus = 'offline';
});

client.on('auth_failure', () => {
  console.log('Autentikasi gagal!');
  botStatus = 'auth_failed';
});

// --- Command Handler System ---
const commands = {};
const commandCategories = {
  game: '🎮 Gaming & Entertainment',
  utility: '🛠️ Utility & Tools',
  creative: '🎨 Creative & Media',
  ai: '🤖 AI & Smart',
  analytics: '📊 Analytics & Monitoring',
  music: '🎵 Music & Audio',
  gamification: '🏆 Gamification',
  education: '📚 Education & Learning',
  admin: '🛡️ Admin & Moderation',
  social: '🌐 Web & Social',
  innovation: '💡 Innovation & Unique'
};

function registerCommand(cmd, handler, desc = '', category = 'general') {
  commands[cmd] = { handler, desc, category };
}

// --- Load Command Modules ---
function loadCommandModules() {
  try {
    const commandFiles = [
      'game', 'utility', 'creative', 'ai', 'analytics',
      'music', 'gamification', 'education', 'admin', 'social', 'innovation'
    ];
    
    commandFiles.forEach(file => {
      try {
        const commandModule = require(`./commands/${file}.js`);
        commandModule.forEach(cmd => {
          registerCommand(cmd.name, cmd.handler, cmd.desc, file);
        });
        console.log(`✅ Loaded ${commandModule.length} commands from ${file}.js`);
      } catch (error) {
        console.log(`❌ Failed to load ${file}.js: ${error.message}`);
      }
    });
  } catch (error) {
    console.log('Error loading command modules:', error);
  }
}

// --- Core Commands ---
registerCommand('help', async (msg, args, user) => {
  if (!args[0]) {
    let helpText = '*🤖 WhatsApp Super Bot - Daftar Kategori:*\n\n';
    Object.entries(commandCategories).forEach(([key, name]) => {
      const categoryCommands = Object.entries(commands)
        .filter(([, cmd]) => cmd.category === key)
        .slice(0, 3); // Show only first 3 commands per category
      if (categoryCommands.length > 0) {
        helpText += `${name}:\n`;
        categoryCommands.forEach(([cmd, cmdData]) => {
          helpText += `  /${cmd} - ${cmdData.desc}\n`;
        });
        helpText += '\n';
      }
    });
    helpText += 'Gunakan /help <kategori> untuk detail lebih lanjut\n';
    helpText += 'Contoh: /help game, /help utility, /help ai';
    msg.reply(helpText);
  } else {
    const category = args[0].toLowerCase();
    if (commandCategories[category]) {
      const categoryCommands = Object.entries(commands)
        .filter(([, cmd]) => cmd.category === category);
      if (categoryCommands.length > 0) {
        let helpText = `*${commandCategories[category]}*\n\n`;
        categoryCommands.forEach(([cmd, cmdData]) => {
          helpText += `/${cmd} - ${cmdData.desc}\n`;
        });
        msg.reply(helpText);
      } else {
        msg.reply('Kategori tidak ditemukan!');
      }
    } else {
      msg.reply('Kategori tidak valid! Gunakan: game, utility, creative, ai, analytics, music, gamification, education, admin, social, innovation');
    }
  }
}, 'Daftar semua command', 'general');

registerCommand('ping', (msg) => {
  const responseTime = Date.now() - msg.timestamp * 1000;
  msg.reply(`🏓 Pong! Response time: ${responseTime}ms\nBot status: ${botStatus}`);
}, 'Tes respon bot', 'general');

registerCommand('status', (msg) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const status = `🤖 *Bot Status:*
Status: ${botStatus}
Uptime: ${hours}h ${minutes}m ${seconds}s
Maintenance: ${maintenanceMode ? 'Ya' : 'Tidak'}
Auto Reply: ${autoReplyEnabled ? 'Aktif' : 'Nonaktif'}
Spam Filter: ${spamFilter ? 'Aktif' : 'Nonaktif'}
Flood Control: ${floodControl.enabled ? 'Aktif' : 'Nonaktif'}`;
  msg.reply(status);
}, 'Cek status bot', 'general');

registerCommand('info', (msg, args, user) => {
  const info = `📱 *Bot Info:*
Versi: 1.0.0
Total Commands: ${Object.keys(commands).length}
Total Users: ${user ? '1' : '0'}
Database: SQLite3
Platform: Node.js
Developer: WhatsApp Super Bot Team

🎯 *Fitur Utama:*
• 50+ Commands
• Gaming & Entertainment
• AI & Smart Features
• Analytics & Monitoring
• Music & Audio
• Admin & Moderation
• Dan banyak lagi!

💡 Gunakan /help untuk melihat semua command`;
  msg.reply(info);
}, 'Info tentang bot', 'general');

// --- Message Processing System ---
client.on('message', async (msg) => {
  // Skip if bot is in maintenance mode
  if (maintenanceMode && !msg.fromMe) {
    return msg.reply('🛠️ Bot sedang dalam maintenance mode. Mohon tunggu sebentar.');
  }

  // Process all messages for analytics
  processMessageForAnalytics(msg);

  // Handle commands
  if (msg.body.startsWith('/')) {
    await handleCommand(msg);
    return;
  }

  // Handle auto-replies
  if (autoReplyEnabled && !msg.fromMe) {
    await handleAutoReply(msg);
  }

  // Handle spam detection
  if (spamFilter && !msg.fromMe) {
    await handleSpamDetection(msg);
  }

  // Handle flood control
  if (floodControl.enabled && !msg.fromMe) {
    await handleFloodControl(msg);
  }
});

// --- Command Handler ---
async function handleCommand(msg) {
  const [cmd, ...args] = msg.body.slice(1).split(' ');
  const command = commands[cmd.toLowerCase()];
  
  if (!command) {
    return msg.reply(`❌ Command tidak ditemukan!\nGunakan /help untuk melihat daftar command.`);
  }

  // Rate limit per user
  try {
    await rateLimiter.consume(msg.from + ':' + (msg.author || msg.from));
  } catch {
    return msg.reply('⚠️ Terlalu banyak command! Mohon tunggu sebentar.');
  }

  // Get or create user
  db.get('SELECT * FROM users WHERE phone = ?', [msg.author || msg.from], (err, user) => {
    if (err) return msg.reply('❌ Database error!');
    
    if (!user) {
      db.run('INSERT INTO users (phone, name, join_date, last_active) VALUES (?, ?, ?, ?)', [
        msg.author || msg.from,
        msg._data.notifyName || 'Unknown',
        moment().format(),
        moment().format(),
      ]);
      user = { phone: msg.author || msg.from, name: msg._data.notifyName || 'Unknown', level: 1, exp: 0, points: 0 };
    }

    // Update last active
    db.run('UPDATE users SET last_active = ? WHERE phone = ?', [moment().format(), user.phone]);

    // Execute command
    try {
      command.handler(msg, args, user);
    } catch (error) {
      console.error('Command error:', error);
      msg.reply('❌ Terjadi error saat menjalankan command!');
    }
  });
}

// --- Auto Reply System ---
async function handleAutoReply(msg) {
  const message = msg.body.toLowerCase();
  const autoReplies = {
    'halo': 'Halo! Ada yang bisa saya bantu? 😊',
    'hai': 'Hai! Senang bertemu denganmu! 👋',
    'terima kasih': 'Sama-sama! Senang bisa membantu! 😄',
    'makasih': 'Sama-sama! Senang bisa membantu! 😄',
    'good morning': 'Selamat pagi! Semoga hari ini menyenangkan! 🌅',
    'good night': 'Selamat malam! Semoga mimpi indah! 🌙',
    'selamat pagi': 'Selamat pagi! Semoga hari ini menyenangkan! 🌅',
    'selamat malam': 'Selamat malam! Semoga mimpi indah! 🌙',
  };

  for (const [trigger, reply] of Object.entries(autoReplies)) {
    if (message.includes(trigger)) {
      msg.reply(reply);
      break;
    }
  }
}

// --- Spam Detection System ---
async function handleSpamDetection(msg) {
  const message = msg.body.toLowerCase();
  
  // Check for blocked words
  for (const word of blockedWords) {
    if (message.includes(word)) {
      msg.reply('🚫 Pesan terdeteksi sebagai spam!');
      // Could implement auto-delete here
      break;
    }
  }

  // Check for blocked links
  for (const link of blockedLinks) {
    if (message.includes(link)) {
      msg.reply('🔗 Link terdeteksi sebagai berbahaya!');
      break;
    }
  }
}

// --- Flood Control System ---
const userMessageCounts = new Map();

async function handleFloodControl(msg) {
  const userId = msg.author || msg.from;
  const now = Date.now();
  
  if (!userMessageCounts.has(userId)) {
    userMessageCounts.set(userId, []);
  }
  
  const userMessages = userMessageCounts.get(userId);
  userMessages.push(now);
  
  // Remove old messages outside the time window
  const timeWindow = floodControl.time * 1000;
  const recentMessages = userMessages.filter(time => now - time < timeWindow);
  userMessageCounts.set(userId, recentMessages);
  
  if (recentMessages.length > floodControl.limit) {
    msg.reply(`⚠️ Terlalu banyak pesan! Mohon tunggu ${floodControl.time} detik.`);
  }
}

// --- Analytics System ---
function processMessageForAnalytics(msg) {
  const messageData = {
    group_id: msg.from,
    user_phone: msg.author || msg.from,
    message: msg.body,
    timestamp: moment().format(),
    message_type: msg.type || 'text',
    sentiment: calculateSentiment(msg.body)
  };

  db.run('INSERT INTO messages (group_id, user_phone, message, timestamp, message_type, sentiment) VALUES (?, ?, ?, ?, ?, ?)', [
    messageData.group_id,
    messageData.user_phone,
    messageData.message,
    messageData.timestamp,
    messageData.message_type,
    messageData.sentiment
  ]);

  // Update user message count
  db.run('UPDATE users SET total_messages = total_messages + 1, exp = exp + 1 WHERE phone = ?', [messageData.user_phone]);

  // Check for level up
  checkLevelUp(messageData.user_phone);
}

function calculateSentiment(text) {
  const positiveWords = ['senang', 'bahagia', 'gembira', 'suka', 'love', 'good', 'great', 'awesome'];
  const negativeWords = ['sedih', 'marah', 'kecewa', 'benci', 'bad', 'terrible', 'awful'];
  
  let score = 0;
  const words = text.toLowerCase().split(' ');
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return score;
}

function checkLevelUp(userPhone) {
  db.get('SELECT level, exp FROM users WHERE phone = ?', [userPhone], (err, user) => {
    if (err || !user) return;
    
    const expNeeded = user.level * 100;
    if (user.exp >= expNeeded) {
      const newLevel = user.level + 1;
      db.run('UPDATE users SET level = ?, exp = exp - ? WHERE phone = ?', [newLevel, expNeeded, userPhone]);
      // Could send level up notification here
    }
  });
}

// --- Scheduled Tasks ---
function startScheduledTasks() {
  // Daily analytics update
  cron.schedule('0 0 * * *', () => {
    updateDailyAnalytics();
  });

  // Reminder check every minute
  cron.schedule('* * * * *', () => {
    checkReminders();
  });

  // Clean up old data weekly
  cron.schedule('0 0 * * 0', () => {
    cleanupOldData();
  });

  console.log('✅ Scheduled tasks started');
}

function updateDailyAnalytics() {
  const today = moment().format('YYYY-MM-DD');
  
  db.get('SELECT COUNT(*) as total_messages FROM messages WHERE date(timestamp) = ?', [today], (err, msgCount) => {
    if (err) return;
    
    db.get('SELECT COUNT(DISTINCT user_phone) as active_users FROM messages WHERE date(timestamp) = ?', [today], (err, userCount) => {
      if (err) return;
      
      // Get most used words
      db.all('SELECT message FROM messages WHERE date(timestamp) = ?', [today], (err, messages) => {
        if (err) return;
        
        const wordCount = {};
        messages.forEach(msg => {
          const words = msg.message.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.length > 2) {
              wordCount[word] = (wordCount[word] || 0) + 1;
            }
          });
        });
        
        db.run('INSERT OR REPLACE INTO analytics (group_id, date, total_messages, active_users, most_used_words) VALUES (?, ?, ?, ?, ?)', [
          'global',
          today,
          msgCount.total_messages,
          userCount.active_users,
          JSON.stringify(wordCount)
        ]);
      });
    });
  });
}

function checkReminders() {
  const now = moment().format();
  
  db.all('SELECT * FROM reminders WHERE reminder_time <= ? AND is_sent = 0', [now], (err, reminders) => {
    if (err || !reminders) return;
    
    reminders.forEach(reminder => {
      // Send reminder message
      client.sendMessage(reminder.group_id, `⏰ *Reminder:* ${reminder.reminder_text}`);
      
      // Mark as sent
      db.run('UPDATE reminders SET is_sent = 1 WHERE id = ?', [reminder.id]);
    });
  });
}

function cleanupOldData() {
  const thirtyDaysAgo = moment().subtract(30, 'days').format();
  
  // Clean up old messages
  db.run('DELETE FROM messages WHERE timestamp < ?', [thirtyDaysAgo]);
  
  // Clean up old analytics
  db.run('DELETE FROM analytics WHERE date < ?', [thirtyDaysAgo]);
  
  console.log('🧹 Cleanup completed');
}

// --- Web Dashboard API ---
app.use(express.static(path.join(__dirname)));

// Use routes
const routes = require('./routes');
app.use('/api', routes);

// Additional API endpoints
app.get('/api/bot/status', (req, res) => {
  res.json({
    status: botStatus,
    uptime: process.uptime(),
    maintenance: maintenanceMode,
    totalCommands: Object.keys(commands).length
  });
});

app.post('/api/bot/maintenance', (req, res) => {
  maintenanceMode = req.body.enabled;
  res.json({ maintenance: maintenanceMode });
});

app.get('/api/commands', (req, res) => {
  const categorizedCommands = {};
  Object.entries(commands).forEach(([cmd, data]) => {
    if (!categorizedCommands[data.category]) {
      categorizedCommands[data.category] = [];
    }
    categorizedCommands[data.category].push({
      name: cmd,
      desc: data.desc
    });
  });
  res.json(categorizedCommands);
});

// --- Error Handling ---
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// --- Initialize Bot ---
client.initialize();
loadCommandModules();

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Super Bot running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`📱 Total commands loaded: ${Object.keys(commands).length}`);
}); 