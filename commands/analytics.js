const db = require('../database');
const moment = require('moment');

module.exports = [
  {
    name: 'stats',
    desc: 'Statistik personal dan grup',
    async handler(msg, args, user) {
      try {
        db.get('SELECT COUNT(*) as total_messages FROM messages WHERE user_phone = ?', [user.phone], (err, msgCount) => {
          if (err) return msg.reply('Error ambil statistik!');
          const stats = `📊 *Statistik Personal:*
Nama: ${user.name}
Level: ${user.level}
Poin: ${user.points}
Total Pesan: ${msgCount.total_messages}
Bergabung: ${moment(user.join_date).format('DD/MM/YYYY')}`;
          msg.reply(stats);
        });
      } catch (error) {
        msg.reply('Error statistik!');
      }
    },
  },
  {
    name: 'grupstats',
    desc: 'Statistik aktivitas grup',
    async handler(msg, args) {
      try {
        db.get('SELECT COUNT(*) as total_messages FROM messages WHERE group_id = ?', [msg.from], (err, msgCount) => {
          if (err) return msg.reply('Error ambil statistik grup!');
          db.get('SELECT COUNT(DISTINCT user_phone) as active_users FROM messages WHERE group_id = ?', [msg.from], (err, userCount) => {
            if (err) return msg.reply('Error ambil statistik grup!');
            const stats = `📈 *Statistik Grup:*
Total Pesan: ${msgCount.total_messages}
Member Aktif: ${userCount.active_users}
Rata-rata per Member: ${Math.round(msgCount.total_messages / userCount.active_users)}`;
            msg.reply(stats);
          });
        });
      } catch (error) {
        msg.reply('Error statistik grup!');
      }
    },
  },
  {
    name: 'wordcloud',
    desc: 'Kata-kata yang paling sering digunakan',
    async handler(msg, args) {
      try {
        db.get('SELECT most_used_words FROM analytics WHERE group_id = ? ORDER BY date DESC LIMIT 1', [msg.from], (err, row) => {
          if (err) return msg.reply('Error ambil word cloud!');
          if (!row || !row.most_used_words) return msg.reply('Belum ada data word cloud.');
          const words = JSON.parse(row.most_used_words);
          const topWords = Object.entries(words)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => `${word}: ${count}x`)
            .join('\n');
          msg.reply(`📝 *Top 10 Kata Populer:*\n${topWords}`);
        });
      } catch (error) {
        msg.reply('Error word cloud!');
      }
    },
  },
  {
    name: 'activity',
    desc: 'Track aktivitas member per hari/minggu',
    async handler(msg, args) {
      try {
        const period = args[0] || 'today';
        let dateFilter = '';
        if (period === 'today') {
          dateFilter = "AND date(timestamp) = date('now')";
        } else if (period === 'week') {
          dateFilter = "AND date(timestamp) >= date('now', '-7 days')";
        } else if (period === 'month') {
          dateFilter = "AND date(timestamp) >= date('now', '-30 days')";
        }
        db.all(`SELECT user_phone, COUNT(*) as message_count 
                FROM messages 
                WHERE group_id = ? ${dateFilter}
                GROUP BY user_phone 
                ORDER BY message_count DESC 
                LIMIT 5`, [msg.from], (err, rows) => {
          if (err) return msg.reply('Error ambil aktivitas!');
          if (rows.length === 0) return msg.reply('Belum ada aktivitas.');
          const activity = rows.map((row, index) => 
            `${index + 1}. ${row.user_phone}: ${row.message_count} pesan`
          ).join('\n');
          msg.reply(`📅 *Top 5 Aktivitas (${period}):*\n${activity}`);
        });
      } catch (error) {
        msg.reply('Error activity tracker!');
      }
    },
  },
  {
    name: 'messageanalytics',
    desc: 'Analisis jenis pesan (text, media, dll)',
    async handler(msg, args) {
      try {
        db.all(`SELECT message_type, COUNT(*) as count 
                FROM messages 
                WHERE group_id = ? 
                GROUP BY message_type`, [msg.from], (err, rows) => {
          if (err) return msg.reply('Error analisis pesan!');
          if (rows.length === 0) return msg.reply('Belum ada data pesan.');
          const analytics = rows.map(row => 
            `${row.message_type || 'text'}: ${row.count}`
          ).join('\n');
          msg.reply(`📊 *Analisis Jenis Pesan:*\n${analytics}`);
        });
      } catch (error) {
        msg.reply('Error message analytics!');
      }
    },
  },
  {
    name: 'moodtracker',
    desc: 'Track mood grup secara keseluruhan',
    async handler(msg, args) {
      try {
        db.all(`SELECT sentiment, COUNT(*) as count 
                FROM messages 
                WHERE group_id = ? AND sentiment IS NOT NULL
                GROUP BY sentiment`, [msg.from], (err, rows) => {
          if (err) return msg.reply('Error mood tracker!');
          if (rows.length === 0) return msg.reply('Belum ada data mood.');
          const moods = rows.map(row => {
            let emoji = '😐';
            if (row.sentiment > 0) emoji = '😊';
            else if (row.sentiment < 0) emoji = '😔';
            return `${emoji} ${row.sentiment > 0 ? 'Positif' : row.sentiment < 0 ? 'Negatif' : 'Netral'}: ${row.count}`;
          }).join('\n');
          msg.reply(`😊 *Mood Grup:*\n${moods}`);
        });
      } catch (error) {
        msg.reply('Error mood tracker!');
      }
    },
  },
  {
    name: 'growth',
    desc: 'Pertumbuhan member grup',
    async handler(msg, args) {
      try {
        db.all(`SELECT date(join_date) as join_date, COUNT(*) as new_members 
                FROM users 
                WHERE join_date >= date('now', '-30 days')
                GROUP BY date(join_date)
                ORDER BY join_date DESC`, (err, rows) => {
          if (err) return msg.reply('Error growth analytics!');
          if (rows.length === 0) return msg.reply('Belum ada data pertumbuhan.');
          const growth = rows.slice(0, 7).map(row => 
            `${row.join_date}: +${row.new_members} member`
          ).join('\n');
          msg.reply(`📈 *Pertumbuhan 7 Hari Terakhir:*\n${growth}`);
        });
      } catch (error) {
        msg.reply('Error growth analytics!');
      }
    },
  },
]; 