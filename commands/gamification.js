const db = require('../database');
const moment = require('moment');

module.exports = [
  {
    name: 'level',
    desc: 'Cek level dan exp',
    async handler(msg, args, user) {
      const expNeeded = user.level * 100;
      const progress = Math.round((user.exp / expNeeded) * 100);
      const levelInfo = `🏆 *Level Info:*
Level: ${user.level}
Exp: ${user.exp}/${expNeeded}
Progress: ${progress}%
Poin: ${user.points}`;
      msg.reply(levelInfo);
    },
  },
  {
    name: 'daily',
    desc: 'Klaim reward harian',
    async handler(msg, args, user) {
      const today = moment().format('YYYY-MM-DD');
      db.get('SELECT * FROM daily_rewards WHERE user_phone = ? AND date = ?', [user.phone, today], (err, reward) => {
        if (err) return msg.reply('Error cek daily reward!');
        if (reward) {
          msg.reply('❌ Reward harian sudah diklaim hari ini!');
        } else {
          const points = Math.floor(Math.random() * 50) + 10;
          const exp = Math.floor(Math.random() * 20) + 5;
          db.run('UPDATE users SET points = points + ?, exp = exp + ? WHERE phone = ?', [points, exp, user.phone]);
          db.run('INSERT INTO daily_rewards (user_phone, date, points, exp) VALUES (?, ?, ?, ?)', [user.phone, today, points, exp]);
          msg.reply(`🎁 *Daily Reward Berhasil!*
+${points} Poin
+${exp} Exp
Kembali lagi besok!`);
        }
      });
    },
  },
  {
    name: 'achievement',
    desc: 'Cek achievement yang sudah unlock',
    async handler(msg, args, user) {
      const achievements = [
        { name: 'First Message', desc: 'Kirim pesan pertama', unlocked: true },
        { name: 'Chat Master', desc: 'Kirim 100 pesan', unlocked: user.total_messages >= 100 },
        { name: 'Point Collector', desc: 'Kumpulkan 500 poin', unlocked: user.points >= 500 },
        { name: 'Level Up', desc: 'Naik ke level 10', unlocked: user.level >= 10 },
        { name: 'Daily Player', desc: 'Login 7 hari berturut', unlocked: false },
      ];
      const unlocked = achievements.filter(a => a.unlocked);
      const locked = achievements.filter(a => !a.unlocked);
      let response = '🏅 *Achievements:*\n\n';
      response += '*Unlocked:*\n';
      unlocked.forEach(a => response += `✅ ${a.name}: ${a.desc}\n`);
      response += '\n*Locked:*\n';
      locked.forEach(a => response += `🔒 ${a.name}: ${a.desc}\n`);
      msg.reply(response);
    },
  },
  {
    name: 'leaderboard',
    desc: 'Ranking member terbaik',
    async handler(msg, args) {
      db.all('SELECT name, points, level, total_messages FROM users ORDER BY points DESC LIMIT 10', (err, rows) => {
        if (err) return msg.reply('Error ambil leaderboard!');
        if (rows.length === 0) return msg.reply('Belum ada data leaderboard.');
        const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const leaderboard = rows.map((row, index) => 
          `${emojis[index]} ${row.name}\n   Poin: ${row.points} | Level: ${row.level} | Pesan: ${row.total_messages}`
        ).join('\n\n');
        msg.reply(`🏆 *Top 10 Leaderboard:*\n\n${leaderboard}`);
      });
    },
  },
  {
    name: 'badge',
    desc: 'Koleksi badge untuk pencapaian',
    async handler(msg, args, user) {
      const badges = [
        { name: 'Newbie', icon: '🆕', desc: 'Member baru', unlocked: true },
        { name: 'Chatter', icon: '💬', desc: '50+ pesan', unlocked: user.total_messages >= 50 },
        { name: 'Rich', icon: '💰', desc: '1000+ poin', unlocked: user.points >= 1000 },
        { name: 'Veteran', icon: '👑', desc: 'Level 20+', unlocked: user.level >= 20 },
        { name: 'Lucky', icon: '🍀', desc: 'Menang 10x game', unlocked: false },
        { name: 'Helper', icon: '🤝', desc: 'Bantu 50 member', unlocked: false },
      ];
      const unlocked = badges.filter(b => b.unlocked);
      const locked = badges.filter(b => !b.unlocked);
      let response = '🏅 *Badges:*\n\n';
      response += '*Unlocked:*\n';
      unlocked.forEach(b => response += `${b.icon} ${b.name}: ${b.desc}\n`);
      response += '\n*Locked:*\n';
      locked.forEach(b => response += `🔒 ${b.name}: ${b.desc}\n`);
      msg.reply(response);
    },
  },
  {
    name: 'exp',
    desc: 'Cara dapat exp',
    async handler(msg) {
      const expGuide = `📈 *Cara Dapat Exp:*
• Kirim pesan: +1 exp
• Main game: +5-20 exp
• Daily reward: +5-25 exp
• Achievement: +50-200 exp
• Bantu member: +10 exp
• Event special: +100 exp

*Level Up:*
Level 1-2: 100 exp
Level 2-3: 200 exp
Level 3-4: 300 exp
Dan seterusnya...`;
      msg.reply(expGuide);
    },
  },
  {
    name: 'shop',
    desc: 'Tukar poin dengan item',
    async handler(msg, args, user) {
      const items = [
        { name: 'Custom Badge', price: 100, desc: 'Badge custom' },
        { name: 'VIP Status', price: 500, desc: 'Status VIP 7 hari' },
        { name: 'Extra Exp', price: 200, desc: '+100 exp' },
        { name: 'Game Boost', price: 150, desc: '2x poin game 1 jam' },
      ];
      if (!args[0]) {
        const shop = items.map(item => 
          `${item.name}: ${item.price} poin\n   ${item.desc}`
        ).join('\n\n');
        msg.reply(`🛒 *Shop:*\n\n${shop}\n\nGunakan: /shop buy <item>`);
      } else if (args[0] === 'buy') {
        const itemName = args.slice(1).join(' ');
        const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (!item) return msg.reply('Item tidak ditemukan!');
        if (user.points < item.price) return msg.reply('Poin tidak cukup!');
        db.run('UPDATE users SET points = points - ? WHERE phone = ?', [item.price, user.phone]);
        msg.reply(`✅ Berhasil beli ${item.name}!\nPoin tersisa: ${user.points - item.price}`);
      }
    },
  },
]; 