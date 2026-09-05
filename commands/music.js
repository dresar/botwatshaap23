const db = require('../database');
const axios = require('axios');

module.exports = [
  {
    name: 'music',
    desc: 'Cari dan play musik',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /music despacito');
      const query = args.join(' ');
      try {
        // Dummy: music search
        const songs = [
          'Despacito - Luis Fonsi',
          'Shape of You - Ed Sheeran',
          'Uptown Funk - Mark Ronson',
          'See You Again - Wiz Khalifa',
          'Sugar - Maroon 5',
        ];
        const song = songs[Math.floor(Math.random() * songs.length)];
        msg.reply(`🎵 *Hasil Pencarian:*\n${song}\n\nLink: https://youtube.com/watch?v=dummy`);
      } catch (error) {
        msg.reply('Error cari musik!');
      }
    },
  },
  {
    name: 'lirik',
    desc: 'Cari lirik lagu favorit',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /lirik despacito');
      const song = args.join(' ');
      try {
        // Dummy: lyrics search
        const lyrics = `🎤 *Lirik ${song}:*
Despacito
Quiero respirar tu cuello despacito
Deja que te diga cosas al oído
Para que te acuerdes si no estás conmigo

Despacito
Quiero desnudarte a besos despacito
Firmo en las paredes de tu laberinto
Y hacer de tu cuerpo todo un manuscrito`;
        msg.reply(lyrics);
      } catch (error) {
        msg.reply('Error cari lirik!');
      }
    },
  },
  {
    name: 'chord',
    desc: 'Chord gitar untuk lagu',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /chord despacito');
      const song = args.join(' ');
      try {
        // Dummy: chord generator
        const chords = `🎸 *Chord ${song}:*
Intro: Am - F - C - G
Verse: Am - F - C - G
Chorus: F - C - G - Am
Bridge: C - G - Am - F

Progression: Am F C G (4x)`;
        msg.reply(chords);
      } catch (error) {
        msg.reply('Error generate chord!');
      }
    },
  },
  {
    name: 'musicquiz',
    desc: 'Kuis tebak lagu',
    async handler(msg, args, user) {
      const songs = [
        { title: 'Despacito', artist: 'Luis Fonsi', hint: 'Lagu Spanyol populer' },
        { title: 'Shape of You', artist: 'Ed Sheeran', hint: 'Lagu dancehall' },
        { title: 'Uptown Funk', artist: 'Mark Ronson', hint: 'Lagu funk' },
      ];
      const song = songs[Math.floor(Math.random() * songs.length)];
      if (!args[0]) {
        return msg.reply(`🎵 *Music Quiz:*\nHint: ${song.hint}\nArtist: ${song.artist}\nTebak judul lagu!`);
      }
      const guess = args.join(' ').toLowerCase();
      if (guess.includes(song.title.toLowerCase())) {
        db.run('UPDATE users SET points = points + 15 WHERE phone = ?', [user.phone]);
        msg.reply(`🎉 Benar! +15 poin\nJudul: ${song.title}`);
      } else {
        msg.reply(`❌ Salah! Jawaban: ${song.title}`);
      }
    },
  },
  {
    name: 'sfx',
    desc: 'Koleksi sound effect lucu',
    async handler(msg, args) {
      const sfx = [
        '🎵 *Sound Effects:*',
        '1. /sfx laugh - Tertawa',
        '2. /sfx clap - Tepuk tangan',
        '3. /sfx drum - Drum roll',
        '4. /sfx bell - Bel',
        '5. /sfx whistle - Peluit',
      ];
      if (!args[0]) return msg.reply(sfx.join('\n'));
      const effect = args[0];
      const effects = {
        laugh: '😂😂😂',
        clap: '👏👏👏',
        drum: '🥁🥁🥁',
        bell: '🔔🔔🔔',
        whistle: '📢📢📢',
      };
      msg.reply(effects[effect] || 'Sound effect tidak ditemukan!');
    },
  },
  {
    name: 'voicetotext',
    desc: 'Convert voice note jadi text',
    async handler(msg, args) {
      if (!msg.hasMedia || !msg.type.includes('ptt')) {
        return msg.reply('Kirim voice note dulu!');
      }
      try {
        // Dummy: voice to text
        const transcriptions = [
          'Halo, apa kabar?',
          'Terima kasih sudah menonton',
          'Selamat pagi semuanya',
          'Sampai jumpa lagi',
          'Have a nice day!',
        ];
        const text = transcriptions[Math.floor(Math.random() * transcriptions.length)];
        msg.reply(`🎤 *Voice to Text:*\n"${text}"`);
      } catch (error) {
        msg.reply('Error convert voice note!');
      }
    },
  },
  {
    name: 'playlist',
    desc: 'Buat playlist musik',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /playlist create "My Playlist"');
      const action = args[0];
      if (action === 'create') {
        const name = args.slice(1).join(' ');
        msg.reply(`📝 Playlist "${name}" berhasil dibuat!`);
      } else if (action === 'add') {
        const song = args.slice(1).join(' ');
        msg.reply(`➕ Lagu "${song}" ditambahkan ke playlist!`);
      } else if (action === 'list') {
        const playlist = [
          '1. Despacito - Luis Fonsi',
          '2. Shape of You - Ed Sheeran',
          '3. Uptown Funk - Mark Ronson',
        ];
        msg.reply(`📋 *Playlist:*\n${playlist.join('\n')}`);
      } else {
        msg.reply('Aksi tidak valid! Gunakan: create/add/list');
      }
    },
  },
]; 