const db = require('../database');
const moment = require('moment');
const axios = require('axios');
const QRCode = require('qrcode');

module.exports = [
  {
    name: 'qr',
    desc: 'Generate QR code dari text/URL',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /qr https://google.com');
      try {
        const qrDataURL = await QRCode.toDataURL(args.join(' '));
        const media = MessageMedia.fromDataURL(qrDataURL, 'qr.png');
        msg.reply(media);
      } catch (error) {
        msg.reply('Error generate QR code!');
      }
    },
  },
  {
    name: 'shorturl',
    desc: 'Pendek URL dengan tracking klik',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /shorturl https://google.com');
      // Dummy: short URL service
      const shortUrl = `https://short.ly/${Math.random().toString(36).substr(2, 6)}`;
      msg.reply(`URL pendek: ${shortUrl}`);
    },
  },
  {
    name: 'remind',
    desc: 'Set reminder dengan notifikasi otomatis',
    async handler(msg, args, user) {
      if (args.length < 2) return msg.reply('Contoh: /remind 5m Beli makan');
      const time = args[0];
      const reminderText = args.slice(1).join(' ');
      const reminderTime = moment().add(parseInt(time), time.slice(-1)).format();
      db.run('INSERT INTO reminders (user_phone, group_id, reminder_text, reminder_time) VALUES (?, ?, ?, ?)', [
        user.phone, msg.from, reminderText, reminderTime,
      ]);
      msg.reply(`Reminder set: ${reminderText} dalam ${time}`);
    },
  },
  {
    name: 'calc',
    desc: 'Kalkulator lengkap dengan fungsi matematika',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /calc 2+2*3');
      try {
        const expression = args.join(' ');
        const result = eval(expression);
        msg.reply(`${expression} = ${result}`);
      } catch (error) {
        msg.reply('Error kalkulasi!');
      }
    },
  },
  {
    name: 'weather',
    desc: 'Cek cuaca real-time',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /weather Jakarta');
      try {
        // Dummy: weather API
        const city = args.join(' ');
        const weather = {
          temp: Math.floor(Math.random() * 35) + 15,
          condition: ['Cerah', 'Berawan', 'Hujan', 'Mendung'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 100),
        };
        msg.reply(`Cuaca ${city}:\n🌡️ ${weather.temp}°C\n☁️ ${weather.condition}\n💧 ${weather.humidity}%`);
      } catch (error) {
        msg.reply('Error cek cuaca!');
      }
    },
  },
  {
    name: 'translate',
    desc: 'Translate bahasa',
    async handler(msg, args) {
      if (args.length < 2) return msg.reply('Contoh: /translate en halo dunia');
      const targetLang = args[0];
      const text = args.slice(1).join(' ');
      try {
        // Dummy: translate API
        const translations = {
          en: 'Hello world',
          ja: 'こんにちは世界',
          ko: '안녕하세요 세계',
          zh: '你好世界',
        };
        const result = translations[targetLang] || 'Translation not available';
        msg.reply(`${text} → ${result}`);
      } catch (error) {
        msg.reply('Error translate!');
      }
    },
  },
  {
    name: 'wiki',
    desc: 'Cari info dari Wikipedia',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /wiki Indonesia');
      try {
        const query = args.join(' ');
        // Dummy: Wikipedia API
        msg.reply(`Info ${query}:\nIndonesia adalah negara kepulauan terbesar di dunia...`);
      } catch (error) {
        msg.reply('Error cari Wikipedia!');
      }
    },
  },
  {
    name: 'barcode',
    desc: 'Scan barcode untuk info produk',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /barcode 123456789');
      try {
        const barcode = args[0];
        // Dummy: barcode API
        msg.reply(`Barcode ${barcode}:\nProduk: Sample Product\nHarga: Rp 50.000`);
      } catch (error) {
        msg.reply('Error scan barcode!');
      }
    },
  },
]; 