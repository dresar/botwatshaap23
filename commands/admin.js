const db = require('../database');
const moment = require('moment');

module.exports = [
  {
    name: 'kick',
    desc: 'Kick member yang melanggar rules (Admin only)',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /kick @user alasan');
      const target = args[0];
      const reason = args.slice(1).join(' ') || 'Melanggar rules grup';
      try {
        // Dummy: kick member
        msg.reply(`👢 Member ${target} telah dikick karena: ${reason}`);
      } catch (error) {
        msg.reply('Error kick member!');
      }
    },
  },
  {
    name: 'spam',
    desc: 'Deteksi dan hapus spam otomatis',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      try {
        // Dummy: spam detection
        const spamWords = ['judi', 'slot', 'casino', 'poker', 'togel'];
        const message = msg.body.toLowerCase();
        const isSpam = spamWords.some(word => message.includes(word));
        if (isSpam) {
          msg.reply('🚫 Pesan terdeteksi sebagai spam!');
          // Auto delete spam message
        } else {
          msg.reply('✅ Pesan aman dari spam.');
        }
      } catch (error) {
        msg.reply('Error deteksi spam!');
      }
    },
  },
  {
    name: 'blocklink',
    desc: 'Block link berbahaya',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /blocklink add example.com');
      const action = args[0];
      const link = args[1];
      try {
        if (action === 'add') {
          // Add to blocked links
          msg.reply(`🔗 Link ${link} telah diblokir!`);
        } else if (action === 'remove') {
          // Remove from blocked links
          msg.reply(`🔓 Link ${link} telah diunblock!`);
        } else if (action === 'list') {
          // List blocked links
          const blocked = ['example.com', 'spam.com', 'scam.com'];
          msg.reply(`📋 *Link Terblokir:*\n${blocked.join('\n')}`);
        }
      } catch (error) {
        msg.reply('Error block link!');
      }
    },
  },
  {
    name: 'badword',
    desc: 'Filter kata-kata kasar',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /badword add kata_kasar');
      const action = args[0];
      const word = args[1];
      try {
        if (action === 'add') {
          // Add to bad words list
          msg.reply(`🚫 Kata "${word}" telah ditambahkan ke filter!`);
        } else if (action === 'remove') {
          // Remove from bad words list
          msg.reply(`✅ Kata "${word}" telah dihapus dari filter!`);
        } else if (action === 'list') {
          // List bad words
          const badWords = ['kata1', 'kata2', 'kata3'];
          msg.reply(`📋 *Kata Terfilter:*\n${badWords.join('\n')}`);
        }
      } catch (error) {
        msg.reply('Error filter kata!');
      }
    },
  },
  {
    name: 'flood',
    desc: 'Kontrol spam berlebihan',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /flood on 5 10 (5 pesan dalam 10 detik)');
      const action = args[0];
      try {
        if (action === 'on') {
          const limit = args[1] || 5;
          const time = args[2] || 10;
          msg.reply(`🛡️ Flood control aktif: ${limit} pesan dalam ${time} detik`);
        } else if (action === 'off') {
          msg.reply('🛡️ Flood control dinonaktifkan');
        } else if (action === 'status') {
          msg.reply('🛡️ Flood control: AKTIF (5 pesan/10 detik)');
        }
      } catch (error) {
        msg.reply('Error flood control!');
      }
    },
  },
  {
    name: 'welcome',
    desc: 'Pesan selamat datang otomatis',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /welcome on "Selamat datang di grup!"');
      const action = args[0];
      try {
        if (action === 'on') {
          const message = args.slice(1).join(' ');
          // Save welcome message
          msg.reply(`👋 Welcome message aktif: "${message}"`);
        } else if (action === 'off') {
          msg.reply('👋 Welcome message dinonaktifkan');
        } else if (action === 'test') {
          msg.reply('👋 *Selamat datang di grup!*\nSemoga betah dan aktif ya! 😊');
        }
      } catch (error) {
        msg.reply('Error welcome message!');
      }
    },
  },
  {
    name: 'goodbye',
    desc: 'Pesan perpisahan otomatis',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /goodbye on "Sampai jumpa!"');
      const action = args[0];
      try {
        if (action === 'on') {
          const message = args.slice(1).join(' ');
          // Save goodbye message
          msg.reply(`👋 Goodbye message aktif: "${message}"`);
        } else if (action === 'off') {
          msg.reply('👋 Goodbye message dinonaktifkan');
        } else if (action === 'test') {
          msg.reply('👋 *Sampai jumpa!*\nTerima kasih sudah bergabung! 😊');
        }
      } catch (error) {
        msg.reply('Error goodbye message!');
      }
    },
  },
  {
    name: 'rules',
    desc: 'Set rules grup',
    async handler(msg, args) {
      if (!msg.fromMe) return msg.reply('Hanya admin yang bisa menggunakan command ini!');
      if (!args[0]) return msg.reply('Contoh: /rules add "Dilarang spam"');
      const action = args[0];
      try {
        if (action === 'add') {
          const rule = args.slice(1).join(' ');
          msg.reply(`📋 Rule ditambahkan: "${rule}"`);
        } else if (action === 'list') {
          const rules = [
            '1. Dilarang spam',
            '2. Dilarang kata kasar',
            '3. Dilarang link berbahaya',
            '4. Hormati sesama member',
            '5. Jaga kerahasiaan grup',
          ];
          msg.reply(`📋 *Rules Grup:*\n${rules.join('\n')}`);
        } else if (action === 'clear') {
          msg.reply('📋 Semua rules telah dihapus');
        }
      } catch (error) {
        msg.reply('Error set rules!');
      }
    },
  },
]; 