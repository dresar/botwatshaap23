const creativeCommands = [
    {
        name: 'meme',
        description: 'Buat meme dari teks',
        usage: '!meme <teks atas> | <teks bawah>',
        category: 'creative',
        execute: async (client, message, args) => {
            if (args.length < 2) {
                return message.reply('❌ Format: !meme <teks atas> | <teks bawah>');
            }
            
            const text = args.join(' ');
            const [topText, bottomText] = text.split('|').map(t => t.trim());
            
            if (!bottomText) {
                return message.reply('❌ Format: !meme <teks atas> | <teks bawah>');
            }
            
            message.reply(`🎨 *Meme Generator*\n\n*Atas:* ${topText}\n*Bawah:* ${bottomText}\n\n_Fitur ini akan segera hadir!_`);
        }
    },
    {
        name: 'quote',
        description: 'Buat quote dengan background',
        usage: '!quote <teks>',
        category: 'creative',
        execute: async (client, message, args) => {
            if (args.length < 1) {
                return message.reply('❌ Format: !quote <teks>');
            }
            
            const text = args.join(' ');
            message.reply(`💭 *Quote Generator*\n\n"${text}"\n\n_Fitur ini akan segera hadir!_`);
        }
    },
    {
        name: 'collage',
        description: 'Buat collage dari gambar',
        usage: '!collage <jumlah baris> <jumlah kolom>',
        category: 'creative',
        execute: async (client, message, args) => {
            if (args.length < 2) {
                return message.reply('❌ Format: !collage <baris> <kolom>');
            }
            
            const rows = parseInt(args[0]);
            const cols = parseInt(args[1]);
            
            if (isNaN(rows) || isNaN(cols)) {
                return message.reply('❌ Baris dan kolom harus berupa angka!');
            }
            
            message.reply(`🖼️ *Collage Generator*\n\n*Ukuran:* ${rows}x${cols}\n*Total:* ${rows * cols} gambar\n\n_Fitur ini akan segera hadir!_`);
        }
    },
    {
        name: 'filter',
        description: 'Terapkan filter pada gambar',
        usage: '!filter <jenis>',
        category: 'creative',
        execute: async (client, message, args) => {
            if (args.length < 1) {
                return message.reply('❌ Format: !filter <jenis>\n\n*Jenis filter:*\n• grayscale\n• sepia\n• blur\n• sharpen\n• invert');
            }
            
            const filterType = args[0].toLowerCase();
            const validFilters = ['grayscale', 'sepia', 'blur', 'sharpen', 'invert'];
            
            if (!validFilters.includes(filterType)) {
                return message.reply(`❌ Filter tidak valid! Pilihan: ${validFilters.join(', ')}`);
            }
            
            message.reply(`🎨 *Filter Applied*\n\n*Jenis:* ${filterType}\n\n_Fitur ini akan segera hadir!_`);
        }
    },
    {
        name: 'sticker',
        description: 'Buat sticker dari gambar',
        usage: '!sticker',
        category: 'creative',
        execute: async (client, message, args) => {
            if (!message.hasMedia) {
                return message.reply('❌ Kirim gambar terlebih dahulu!');
            }
            
            message.reply(`🖼️ *Sticker Maker*\n\n_Fitur ini akan segera hadir!_`);
        }
    },
    {
        name: 'gif',
        description: 'Buat GIF dari video',
        usage: '!gif <durasi>',
        category: 'creative',
        execute: async (client, message, args) => {
            if (!message.hasMedia) {
                return message.reply('❌ Kirim video terlebih dahulu!');
            }
            
            const duration = args[0] || 5;
            message.reply(`🎬 *GIF Maker*\n\n*Durasi:* ${duration} detik\n\n_Fitur ini akan segera hadir!_`);
        }
    }
];

module.exports = creativeCommands; 