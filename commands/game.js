const db = require('../database');
const moment = require('moment');
const axios = require('axios');

module.exports = [
  {
    name: 'quiz',
    desc: 'Main kuis interaktif',
    async handler(msg, args, user) {
      // Contoh kuis sederhana
      const soal = {
        q: 'Ibukota Indonesia?',
        a: 'jakarta',
      };
      if (!args[0]) return msg.reply(`Kuis: ${soal.q}`);
      if (args.join(' ').toLowerCase() === soal.a) {
        db.run('UPDATE users SET points = points + 10 WHERE phone = ?', [user.phone]);
        return msg.reply('Benar! +10 poin');
      } else {
        return msg.reply('Salah!');
      }
    },
  },
  {
    name: 'tebakkata',
    desc: 'Game tebak kata dengan hint',
    async handler(msg, args, user) {
      // Tebak kata sederhana
      const kata = 'komputer';
      const hint = 'K__p__t__';
      if (!args[0]) return msg.reply(`Tebak kata: ${hint}`);
      if (args.join(' ').toLowerCase() === kata) {
        db.run('UPDATE users SET points = points + 5 WHERE phone = ?', [user.phone]);
        return msg.reply('Benar! +5 poin');
      } else {
        return msg.reply('Salah!');
      }
    },
  },
  {
    name: 'suit',
    desc: 'Suit (gunting batu kertas) lawan bot',
    async handler(msg, args, user) {
      const pilihan = ['gunting', 'batu', 'kertas'];
      if (!args[0]) return msg.reply('Pilih: gunting/batu/kertas');
      const userPick = args[0].toLowerCase();
      const botPick = pilihan[Math.floor(Math.random() * 3)];
      let hasil = '';
      if (userPick === botPick) hasil = 'Seri!';
      else if (
        (userPick === 'gunting' && botPick === 'kertas') ||
        (userPick === 'batu' && botPick === 'gunting') ||
        (userPick === 'kertas' && botPick === 'batu')
      ) {
        hasil = 'Kamu menang! +3 poin';
        db.run('UPDATE users SET points = points + 3 WHERE phone = ?', [user.phone]);
      } else {
        hasil = 'Bot menang!';
      }
      msg.reply(`Kamu: ${userPick}\nBot: ${botPick}\n${hasil}`);
    },
  },
  {
    name: 'slot',
    desc: 'Main slot machine',
    async handler(msg, args, user) {
      const items = ['🍒', '🍋', '🍊', '🍉', '⭐'];
      const spin = [0,0,0].map(() => items[Math.floor(Math.random()*items.length)]);
      let reward = 0;
      if (spin[0] === spin[1] && spin[1] === spin[2]) reward = 20;
      else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) reward = 5;
      if (reward) db.run('UPDATE users SET points = points + ? WHERE phone = ?', [reward, user.phone]);
      msg.reply(`🎰 ${spin.join(' ')}\n${reward ? 'Menang! +' + reward + ' poin' : 'Coba lagi!'}`);
    },
  },
  {
    name: 'truthdare',
    desc: 'Truth or Dare random',
    async handler(msg) {
      const truth = ['Apa rahasia terbesarmu?', 'Siapa gebetanmu?'];
      const dare = ['Push up 10x!', 'Chat mantan!'];
      const tipe = Math.random() > 0.5 ? 'Truth' : 'Dare';
      const soal = tipe === 'Truth' ? truth[Math.floor(Math.random()*truth.length)] : dare[Math.floor(Math.random()*dare.length)];
      msg.reply(`${tipe}: ${soal}`);
    },
  },
  {
    name: 'jadwaltayang',
    desc: 'Cek jadwal tayang anime/drakor/film',
    async handler(msg, args) {
      // Dummy: fetch jadwal dari API (contoh)
      msg.reply('Fitur jadwal tayang coming soon!');
    },
  },
]; 