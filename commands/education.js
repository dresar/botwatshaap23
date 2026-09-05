const educationCommands = [
    {
        name: 'kamus',
        description: 'Kamus bahasa Indonesia/Inggris',
        usage: '!kamus <kata>',
        category: 'education',
        execute: async (client, message, args) => {
            if (!args[0]) {
                return message.reply('❌ Format: !kamus <kata>\n\nContoh: !kamus hello');
            }
            
            const word = args[0].toLowerCase();
            const dictionary = {
                hello: { id: 'halo', en: 'hello', desc: 'Sapaan dalam bahasa Inggris' },
                world: { id: 'dunia', en: 'world', desc: 'Planet tempat kita hidup' },
                computer: { id: 'komputer', en: 'computer', desc: 'Alat elektronik untuk komputasi' },
                book: { id: 'buku', en: 'book', desc: 'Kumpulan kertas berisi tulisan' },
                water: { id: 'air', en: 'water', desc: 'Cairan yang diperlukan untuk hidup' },
                makan: { id: 'makan', en: 'eat', desc: 'Memasukkan makanan ke mulut' },
                minum: { id: 'minum', en: 'drink', desc: 'Memasukkan cairan ke mulut' },
                tidur: { id: 'tidur', en: 'sleep', desc: 'Keadaan istirahat tubuh' }
            };
            
            const result = dictionary[word];
            if (result) {
                message.reply(`📚 *Kamus:*\n\n*Indonesia:* ${result.id}\n*English:* ${result.en}\n*Deskripsi:* ${result.desc}`);
            } else {
                message.reply('❌ Kata tidak ditemukan dalam kamus!');
            }
        }
    },
    {
        name: 'scicalc',
        description: 'Kalkulator ilmiah untuk rumus fisika/kimia',
        usage: '!scicalc <rumus> <nilai1> <nilai2> ...',
        category: 'education',
        execute: async (client, message, args) => {
            if (!args[0]) {
                return message.reply('❌ Format: !scicalc <rumus> <nilai1> <nilai2> ...\n\nContoh: !scicalc area 10 5');
            }
            
            const formula = args[0];
            const values = args.slice(1).map(v => parseFloat(v));
            
            try {
                let result = '';
                switch (formula) {
                    case 'area':
                        if (values.length === 2) {
                            result = `📐 *Luas Persegi Panjang*\n\n${values[0]} × ${values[1]} = ${values[0] * values[1]}`;
                        } else {
                            result = '❌ Format: !scicalc area <panjang> <lebar>';
                        }
                        break;
                    case 'volume':
                        if (values.length === 3) {
                            result = `📦 *Volume Balok*\n\n${values[0]} × ${values[1]} × ${values[2]} = ${values[0] * values[1] * values[2]}`;
                        } else {
                            result = '❌ Format: !scicalc volume <panjang> <lebar> <tinggi>';
                        }
                        break;
                    case 'speed':
                        if (values.length === 2) {
                            result = `🏃 *Kecepatan*\n\n${values[0]} ÷ ${values[1]} = ${(values[0] / values[1]).toFixed(2)} m/s`;
                        } else {
                            result = '❌ Format: !scicalc speed <jarak> <waktu>';
                        }
                        break;
                    case 'density':
                        if (values.length === 2) {
                            result = `⚖️ *Massa Jenis*\n\n${values[0]} ÷ ${values[1]} = ${(values[0] / values[1]).toFixed(2)} kg/m³`;
                        } else {
                            result = '❌ Format: !scicalc density <massa> <volume>';
                        }
                        break;
                    default:
                        result = '❌ Rumus tidak dikenal!\n\n*Rumus yang tersedia:*\n• area (luas persegi panjang)\n• volume (volume balok)\n• speed (kecepatan)\n• density (massa jenis)';
                }
                message.reply(result);
            } catch (error) {
                message.reply('❌ Error dalam kalkulasi!');
            }
        }
    },
    {
        name: 'convert',
        description: 'Convert satuan (meter, liter, dll)',
        usage: '!convert <jenis> <nilai> <dari> <ke>',
        category: 'education',
        execute: async (client, message, args) => {
            if (args.length < 4) {
                return message.reply('❌ Format: !convert <jenis> <nilai> <dari> <ke>\n\nContoh: !convert length 1 km m');
            }
            
            const type = args[0];
            const value = parseFloat(args[1]);
            const from = args[2];
            const to = args[3];
            
            try {
                let result = '';
                if (type === 'length') {
                    const conversions = {
                        km: 1000, m: 1, cm: 0.01, mm: 0.001
                    };
                    const meters = value * conversions[from];
                    const converted = meters / conversions[to];
                    result = `📏 *Konversi Panjang*\n\n${value} ${from} = ${converted.toFixed(4)} ${to}`;
                } else if (type === 'weight') {
                    const conversions = {
                        kg: 1, g: 0.001, mg: 0.000001
                    };
                    const kg = value * conversions[from];
                    const converted = kg / conversions[to];
                    result = `⚖️ *Konversi Berat*\n\n${value} ${from} = ${converted.toFixed(4)} ${to}`;
                } else if (type === 'volume') {
                    const conversions = {
                        l: 1, ml: 0.001, kl: 1000
                    };
                    const liters = value * conversions[from];
                    const converted = liters / conversions[to];
                    result = `🧪 *Konversi Volume*\n\n${value} ${from} = ${converted.toFixed(4)} ${to}`;
                } else {
                    result = '❌ Jenis konversi tidak dikenal!\n\n*Jenis yang tersedia:*\n• length (panjang)\n• weight (berat)\n• volume (volume)';
                }
                message.reply(result);
            } catch (error) {
                message.reply('❌ Error dalam konversi!');
            }
        }
    },
    {
        name: 'quiz',
        description: 'Kuis pengetahuan umum',
        usage: '!quiz',
        category: 'education',
        execute: async (client, message, args) => {
            const questions = [
                {
                    question: 'Ibu kota Indonesia adalah?',
                    options: ['A. Jakarta', 'B. Bandung', 'C. Surabaya', 'D. Medan'],
                    answer: 'A'
                },
                {
                    question: 'Planet terbesar di tata surya adalah?',
                    options: ['A. Bumi', 'B. Mars', 'C. Jupiter', 'D. Saturnus'],
                    answer: 'C'
                },
                {
                    question: '2 + 2 × 4 = ?',
                    options: ['A. 8', 'B. 10', 'C. 16', 'D. 12'],
                    answer: 'B'
                }
            ];
            
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            const quizText = `🎯 *Kuis Pengetahuan Umum*\n\n*Pertanyaan:*\n${randomQuestion.question}\n\n*Pilihan:*\n${randomQuestion.options.join('\n')}\n\nJawab dengan: !answer <huruf>`;
            
            // Simpan jawaban untuk sementara
            client.quizAnswers = client.quizAnswers || {};
            client.quizAnswers[message.from] = randomQuestion.answer;
            
            message.reply(quizText);
        }
    },
    {
        name: 'answer',
        description: 'Jawab kuis',
        usage: '!answer <huruf>',
        category: 'education',
        execute: async (client, message, args) => {
            if (!args[0]) {
                return message.reply('❌ Format: !answer <huruf>');
            }
            
            const userAnswer = args[0].toUpperCase();
            const correctAnswer = client.quizAnswers?.[message.from];
            
            if (!correctAnswer) {
                return message.reply('❌ Tidak ada kuis aktif! Gunakan !quiz untuk memulai.');
            }
            
            if (userAnswer === correctAnswer) {
                message.reply('✅ *Jawaban Benar!* 🎉');
            } else {
                message.reply(`❌ *Jawaban Salah!*\n\nJawaban yang benar adalah: *${correctAnswer}*`);
            }
            
            delete client.quizAnswers[message.from];
        }
    },
    {
        name: 'periodic',
        description: 'Tabel periodik unsur kimia',
        usage: '!periodic <simbol>',
        category: 'education',
        execute: async (client, message, args) => {
            if (!args[0]) {
                return message.reply('❌ Format: !periodic <simbol>\n\nContoh: !periodic H');
            }
            
            const symbol = args[0].toUpperCase();
            const elements = {
                'H': { name: 'Hidrogen', number: 1, mass: '1.008', type: 'Non-logam' },
                'O': { name: 'Oksigen', number: 8, mass: '15.999', type: 'Non-logam' },
                'C': { name: 'Karbon', number: 6, mass: '12.011', type: 'Non-logam' },
                'N': { name: 'Nitrogen', number: 7, mass: '14.007', type: 'Non-logam' },
                'Fe': { name: 'Besi', number: 26, mass: '55.845', type: 'Logam transisi' },
                'Au': { name: 'Emas', number: 79, mass: '196.967', type: 'Logam transisi' },
                'Ag': { name: 'Perak', number: 47, mass: '107.868', type: 'Logam transisi' }
            };
            
            const element = elements[symbol];
            if (element) {
                message.reply(`🧪 *Tabel Periodik*\n\n*Simbol:* ${symbol}\n*Nama:* ${element.name}\n*Nomor Atom:* ${element.number}\n*Massa Atom:* ${element.mass}\n*Jenis:* ${element.type}`);
            } else {
                message.reply('❌ Unsur tidak ditemukan!\n\n*Contoh unsur:* H, O, C, N, Fe, Au, Ag');
            }
        }
    },
    {
        name: 'formula',
        description: 'Rumus matematika dan fisika',
        usage: '!formula <jenis>',
        category: 'education',
        execute: async (client, message, args) => {
            if (!args[0]) {
                return message.reply('❌ Format: !formula <jenis>\n\n*Jenis:*\n• luas\n• volume\n• kecepatan\n• energi');
            }
            
            const type = args[0].toLowerCase();
            const formulas = {
                luas: '📐 *Rumus Luas*\n\n• Persegi: s × s\n• Persegi Panjang: p × l\n• Segitiga: ½ × a × t\n• Lingkaran: π × r²',
                volume: '📦 *Rumus Volume*\n\n• Kubus: s³\n• Balok: p × l × t\n• Tabung: π × r² × t\n• Kerucut: ⅓ × π × r² × t',
                kecepatan: '🏃 *Rumus Kecepatan*\n\n• Kecepatan: jarak ÷ waktu\n• Percepatan: perubahan kecepatan ÷ waktu\n• Kecepatan rata-rata: total jarak ÷ total waktu',
                energi: '⚡ *Rumus Energi*\n\n• Energi Kinetik: ½ × m × v²\n• Energi Potensial: m × g × h\n• Energi Listrik: P × t\n• Energi Panas: m × c × ΔT'
            };
            
            const formula = formulas[type];
            if (formula) {
                message.reply(formula);
            } else {
                message.reply('❌ Jenis rumus tidak ditemukan!\n\n*Jenis yang tersedia:*\n• luas\n• volume\n• kecepatan\n• energi');
            }
        }
    }
];

module.exports = educationCommands; 