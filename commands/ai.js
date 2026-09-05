const db = require('../database');
const axios = require('axios');

module.exports = [
  {
    name: 'ai',
    desc: 'Chatbot pintar dengan AI',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /ai Apa kabar?');
      const question = args.join(' ');
      try {
        // Dummy: AI response
        const responses = [
          'Saya baik-baik saja, terima kasih!',
          'Itu pertanyaan yang menarik!',
          'Saya tidak yakin, bisa dijelaskan lebih detail?',
          'Menurut saya, itu tergantung situasinya.',
          'Saya sedang belajar tentang hal itu.',
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        msg.reply(`AI: ${response}`);
      } catch (error) {
        msg.reply('Error AI response!');
      }
    },
  },
  {
    name: 'sentiment',
    desc: 'Analisis mood dari pesan',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /sentiment Saya senang hari ini!');
      const text = args.join(' ');
      try {
        // Dummy: sentiment analysis
        const positiveWords = ['senang', 'bahagia', 'gembira', 'suka', 'love', 'good', 'great'];
        const negativeWords = ['sedih', 'marah', 'kecewa', 'benci', 'bad', 'terrible'];
        let score = 0;
        for (const word of positiveWords) {
          if (text.toLowerCase().includes(word)) score += 1;
        }
        for (const word of negativeWords) {
          if (text.toLowerCase().includes(word)) score -= 1;
        }
        let sentiment = 'Netral';
        if (score > 0) sentiment = 'Positif 😊';
        else if (score < 0) sentiment = 'Negatif 😔';
        msg.reply(`Sentiment: ${sentiment} (Score: ${score})`);
      } catch (error) {
        msg.reply('Error analisis sentiment!');
      }
    },
  },
  {
    name: 'keyword',
    desc: 'Deteksi kata kunci penting',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /keyword Pesan penting tentang meeting');
      const text = args.join(' ');
      try {
        // Dummy: keyword detection
        const keywords = ['meeting', 'deadline', 'urgent', 'penting', 'segera'];
        const found = keywords.filter(keyword => 
          text.toLowerCase().includes(keyword)
        );
        if (found.length > 0) {
          msg.reply(`Kata kunci terdeteksi: ${found.join(', ')}`);
        } else {
          msg.reply('Tidak ada kata kunci penting terdeteksi.');
        }
      } catch (error) {
        msg.reply('Error deteksi keyword!');
      }
    },
  },
  {
    name: 'autotranslate',
    desc: 'Translate otomatis pesan asing',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /autotranslate Hello world');
      const text = args.join(' ');
      try {
        // Dummy: auto translate
        const translations = {
          'hello': 'halo',
          'world': 'dunia',
          'good': 'baik',
          'morning': 'pagi',
          'night': 'malam',
        };
        let translated = text;
        for (const [eng, ind] of Object.entries(translations)) {
          translated = translated.replace(new RegExp(eng, 'gi'), ind);
        }
        msg.reply(`Auto translate: ${translated}`);
      } catch (error) {
        msg.reply('Error auto translate!');
      }
    },
  },
  {
    name: 'smartreply',
    desc: 'Saran balasan cerdas',
    async handler(msg, args) {
      if (!args[0]) return msg.reply('Contoh: /smartreply Bagaimana kabarmu?');
      const context = args.join(' ');
      try {
        // Dummy: smart reply suggestions
        const suggestions = [
          'Baik-baik saja, terima kasih!',
          'Alhamdulillah sehat selalu.',
          'Sedang sibuk dengan kerjaan.',
          'Lagi santai di rumah.',
          'Mau ngapain ya?',
        ];
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        msg.reply(`Saran balasan: ${suggestion}`);
      } catch (error) {
        msg.reply('Error generate smart reply!');
      }
    },
  },
  {
    name: 'quote',
    desc: 'Quote inspiratif harian',
    async handler(msg) {
      try {
        const quotes = [
          'Hidup adalah perjalanan, bukan tujuan.',
          'Kesuksesan adalah kemampuan untuk bangkit dari kegagalan.',
          'Mimpi besar, mulai dari langkah kecil.',
          'Kualitas hidup ditentukan oleh kualitas pikiran.',
          'Setiap hari adalah kesempatan baru untuk menjadi lebih baik.',
          'Kesabaran adalah kunci kesuksesan.',
          'Jangan takut gagal, takutlah tidak pernah mencoba.',
          'Kebahagiaan adalah pilihan, bukan hasil.',
          'Belajar dari masa lalu, hidup di masa kini, bermimpi masa depan.',
          'Kebaikan yang kecil tetap lebih baik daripada tidak sama sekali.',
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        msg.reply(`💭 Quote hari ini:\n"${quote}"`);
      } catch (error) {
        msg.reply('Error generate quote!');
      }
    },
  },
]; 