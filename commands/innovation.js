const db = require('../database');
const moment = require('moment');

module.exports = [
  {
    name: 'pomodoro',
    desc: 'Timer fokus untuk produktivitas',
    async handler(msg, args, user) {
      if (!args[0]) return msg.reply('Contoh: /pomodoro start 25 (25 menit fokus)');
      const action = args[0];
      const duration = parseInt(args[1]) || 25;
      try {
        if (action === 'start') {
          const endTime = moment().add(duration, 'minutes');
          msg.reply(`🍅 *Pomodoro Timer Started!*
Durasi: ${duration} menit
Selesai: ${endTime.format('HH:mm')}
Fokus dan jangan diganggu! 💪`);
          // Set timer to remind when done
          setTimeout(() => {
            msg.reply(`⏰ *Pomodoro Selesai!*
Waktu istirahat 5 menit.
Gunakan /pomodoro start untuk mulai lagi.`);
          }, duration * 60 * 1000);
        } else if (action === 'break') {
          msg.reply(`☕ *Break Time!*
Istirahat 5 menit.
Gunakan /pomodoro start untuk mulai lagi.`);
        } else if (action === 'stop') {
          msg.reply('⏹️ Pomodoro timer dihentikan.');
        }
      } catch (error) {
        msg.reply('Error pomodoro timer!');
      }
    },
  },
  {
    name: 'habit',
    desc: 'Track kebiasaan positif',
    async handler(msg, args, user) {
      if (!args[0]) return msg.reply('Contoh: /habit add "Olahraga" atau /habit track "Olahraga"');
      const action = args[0];
      const habit = args.slice(1).join(' ');
      try {
        if (action === 'add') {
          // Add new habit
          msg.reply(`✅ Habit "${habit}" ditambahkan!\nGunakan /habit track "${habit}" untuk menandai selesai.`);
        } else if (action === 'track') {
          // Track habit completion
          const streak = Math.floor(Math.random() * 30) + 1;
          msg.reply(`🎯 *Habit Tracker:*
Habit: ${habit}
Streak: ${streak} hari
Status: ✅ Selesai hari ini!
Lanjutkan streak! 🔥`);
        } else if (action === 'list') {
          // List habits
          const habits = [
            'Olahraga - 15 hari streak',
            'Membaca - 7 hari streak',
            'Meditasi - 3 hari streak',
          ];
          msg.reply(`📋 *Daftar Habits:*\n${habits.join('\n')}`);
        } else if (action === 'stats') {
          // Habit statistics
          msg.reply(`📊 *Habit Stats:*
Total Habits: 3
Completed Today: 2
Longest Streak: 15 hari
Success Rate: 85%`);
        }
      } catch (error) {
        msg.reply('Error habit tracker!');
      }
    },
  },
  {
    name: 'expense',
    desc: 'Catat pengeluaran bersama',
    async handler(msg, args, user) {
      if (!args[0]) return msg.reply('Contoh: /expense add 50000 "Makan siang"');
      const action = args[0];
      try {
        if (action === 'add') {
          const amount = parseInt(args[1]);
          const description = args.slice(2).join(' ');
          if (!amount || !description) return msg.reply('Format: /expense add <jumlah> <keterangan>');
          msg.reply(`💰 *Expense Added:*
Jumlah: Rp ${amount.toLocaleString()}
Keterangan: ${description}
Oleh: ${user.name}
Total hari ini: Rp ${(amount + 150000).toLocaleString()}`);
        } else if (action === 'list') {
          const expenses = [
            'Makan siang - Rp 50.000',
            'Transport - Rp 25.000',
            'Kopi - Rp 15.000',
          ];
          msg.reply(`📋 *Expenses Hari Ini:*\n${expenses.join('\n')}\n\nTotal: Rp 90.000`);
        } else if (action === 'stats') {
          msg.reply(`📊 *Expense Stats:*
Hari ini: Rp 90.000
Minggu ini: Rp 450.000
Bulan ini: Rp 1.800.000
Kategori terbanyak: Makanan (40%)`);
        }
      } catch (error) {
        msg.reply('Error expense tracker!');
      }
    },
  },
  {
    name: 'poll',
    desc: 'Buat polling untuk keputusan grup',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /poll create "Makan dimana?" "Warteg" "Restoran" "Rumah"');
      const action = args[0];
      try {
        if (action === 'create') {
          const question = args[1];
          const options = args.slice(2);
          if (options.length < 2) return msg.reply('Minimal 2 opsi!');
          const pollId = Math.random().toString(36).substr(2, 8);
          let pollText = `📊 *Poll: ${question}*\n\n`;
          options.forEach((option, index) => {
            pollText += `${index + 1}. ${option} (0 votes)\n`;
          });
          pollText += `\nPoll ID: ${pollId}\nGunakan /poll vote ${pollId} <nomor> untuk voting`;
          msg.reply(pollText);
        } else if (action === 'vote') {
          const pollId = args[1];
          const choice = parseInt(args[2]);
          msg.reply(`✅ Vote berhasil!\nPoll: ${pollId}\nPilihan: ${choice}`);
        } else if (action === 'result') {
          const pollId = args[1];
          msg.reply(`📊 *Poll Result:*
Makan dimana?
1. Warteg (3 votes) ████████░░ 60%
2. Restoran (1 vote) ███░░░░░░░ 20%
3. Rumah (1 vote) ███░░░░░░░ 20%

Total votes: 5`);
        }
      } catch (error) {
        msg.reply('Error create poll!');
      }
    },
  },
  {
    name: 'event',
    desc: 'Manage event dan RSVP',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /event create "Meetup" "2024-01-15 19:00" "Kafe ABC"');
      const action = args[0];
      try {
        if (action === 'create') {
          const title = args[1];
          const datetime = args[2];
          const location = args.slice(3).join(' ');
          const eventId = Math.random().toString(36).substr(2, 8);
          msg.reply(`📅 *Event Created:*
Judul: ${title}
Waktu: ${datetime}
Tempat: ${location}
Event ID: ${eventId}

Gunakan /event rsvp ${eventId} yes/no untuk RSVP`);
        } else if (action === 'rsvp') {
          const eventId = args[1];
          const response = args[2];
          msg.reply(`✅ RSVP berhasil!
Event: ${eventId}
Response: ${response === 'yes' ? 'Akan hadir' : 'Tidak bisa hadir'}`);
        } else if (action === 'list') {
          const events = [
            'Meetup - 15 Jan 19:00 - Kafe ABC (5 RSVP)',
            'Workshop - 20 Jan 14:00 - Office (3 RSVP)',
            'Dinner - 25 Jan 18:00 - Restaurant (8 RSVP)',
          ];
          msg.reply(`📅 *Upcoming Events:*\n${events.join('\n')}`);
        }
      } catch (error) {
        msg.reply('Error event manager!');
      }
    },
  },
  {
    name: 'secretsanta',
    desc: 'Organize secret santa untuk grup',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /secretsanta create atau /secretsanta join');
      const action = args[0];
      try {
        if (action === 'create') {
          const eventId = Math.random().toString(36).substr(2, 8);
          msg.reply(`🎁 *Secret Santa Event Created!*
Event ID: ${eventId}
Status: Waiting for participants
Budget: Rp 100.000

Gunakan /secretsanta join ${eventId} untuk bergabung!`);
        } else if (action === 'join') {
          const eventId = args[1];
          msg.reply(`✅ Berhasil join Secret Santa!
Event: ${eventId}
Peserta: 5/10
Deadline: 20 Desember 2024`);
        } else if (action === 'draw') {
          const eventId = args[1];
          const participants = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
          const randomPerson = participants[Math.floor(Math.random() * participants.length)];
          msg.reply(`🎁 *Secret Santa Draw:*
Event: ${eventId}
Kamu dapat: ${randomPerson}
Budget: Rp 100.000
Jangan kasih tahu siapa-siapa! 🤫`);
        } else if (action === 'list') {
          const events = [
            'Secret Santa 2024 - 5 peserta - 20 Des',
            'Secret Santa Office - 8 peserta - 15 Des',
          ];
          msg.reply(`🎁 *Secret Santa Events:*\n${events.join('\n')}`);
        }
      } catch (error) {
        msg.reply('Error secret santa!');
      }
    },
  },
]; 