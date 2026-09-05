# Contributing to WhatsApp Super Bot

Terima kasih atas minat Anda untuk berkontribusi pada WhatsApp Super Bot! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 🤝 Code of Conduct

Proyek ini dan semua kontributornya diatur oleh [Code of Conduct](CODE_OF_CONDUCT.md). Dengan berpartisipasi, Anda diharapkan untuk mematuhi kode ini.

## 🚀 How Can I Contribute?

### Reporting Bugs
- Gunakan template bug report
- Sertakan langkah-langkah reproduksi yang jelas
- Jelaskan perilaku yang diharapkan vs yang terjadi
- Sertakan informasi sistem dan versi

### Suggesting Enhancements
- Jelaskan fitur yang diinginkan
- Berikan use case yang jelas
- Pertimbangkan dampak pada performa
- Diskusikan dengan maintainer terlebih dahulu

### Pull Requests
- Fork repository
- Buat branch untuk fitur baru
- Ikuti coding standards
- Tambahkan tests jika diperlukan
- Update dokumentasi

## 🛠️ Development Setup

### Prerequisites
- Node.js 16.0.0+
- npm atau yarn
- Git

### Setup Steps
```bash
# Fork dan clone repository
git clone https://github.com/YOUR_USERNAME/whatsapp-super-bot.git
cd whatsapp-super-bot

# Install dependencies
npm install

# Setup development environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Start development server
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000
DEBUG=true
```

## 📝 Coding Standards

### JavaScript/Node.js
- Gunakan ES6+ features
- Ikuti [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Gunakan async/await untuk asynchronous operations
- Tambahkan JSDoc comments untuk functions

### Command Structure
```javascript
// commands/example.js
const db = require('../database');

module.exports = [
  {
    name: 'example',
    desc: 'Description of the command',
    async handler(msg, args, user) {
      try {
        // Command logic here
        msg.reply('Response message');
      } catch (error) {
        console.error('Command error:', error);
        msg.reply('❌ Error occurred!');
      }
    },
  },
];
```

### Database Operations
```javascript
// Always use parameterized queries
db.run('INSERT INTO table (column) VALUES (?)', [value]);

// Handle errors properly
db.get('SELECT * FROM table WHERE id = ?', [id], (err, row) => {
  if (err) {
    console.error('Database error:', err);
    return;
  }
  // Process row
});
```

### Error Handling
```javascript
try {
  // Risky operation
} catch (error) {
  console.error('Error description:', error);
  // Provide user-friendly error message
  msg.reply('❌ Terjadi error. Silakan coba lagi.');
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- commands/game.test.js

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
```javascript
// commands/game.test.js
const { expect } = require('chai');
const gameCommands = require('./game');

describe('Game Commands', () => {
  describe('/quiz command', () => {
    it('should return quiz question when no answer provided', () => {
      // Test implementation
    });

    it('should give points for correct answer', () => {
      // Test implementation
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting PR
1. **Fork repository** dan buat branch baru
2. **Install dependencies** dan setup development environment
3. **Write code** mengikuti coding standards
4. **Add tests** untuk fitur baru
5. **Update documentation** jika diperlukan
6. **Test thoroughly** sebelum submit

### PR Checklist
- [ ] Code follows project standards
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Security considerations addressed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have made corresponding changes to documentation
```

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Windows 10, macOS, Linux]
- Node.js Version: [e.g. 16.0.0]
- Bot Version: [e.g. 1.0.0]

## Additional Context
Any other context about the problem
```

## 💡 Suggesting Enhancements

### Enhancement Request Template
```markdown
## Enhancement Description
Clear and concise description of the enhancement

## Use Case
Why is this enhancement needed?

## Proposed Solution
How would you implement this?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## 📚 Documentation

### Adding New Commands
1. Buat file baru di folder `commands/`
2. Ikuti struktur command yang ada
3. Tambahkan deskripsi yang jelas
4. Update README.md dengan command baru
5. Tambahkan contoh penggunaan

### Updating API Documentation
1. Update routes.js jika menambah endpoint baru
2. Dokumentasikan parameter dan response
3. Tambahkan contoh request/response
4. Update API documentation di README

## 🔒 Security

### Security Guidelines
- Jangan commit credentials atau API keys
- Validasi semua user input
- Gunakan parameterized queries
- Implement rate limiting
- Sanitize output data

### Reporting Security Issues
- Jangan buat public issue untuk security bugs
- Email ke security@whatsappsuperbot.com
- Tunggu response sebelum disclose publicly

## 🎯 Getting Help

### Resources
- [README.md](README.md) - Setup dan usage guide
- [Issues](https://github.com/yourusername/whatsapp-super-bot/issues) - Existing issues
- [Discussions](https://github.com/yourusername/whatsapp-super-bot/discussions) - Community discussions

### Contact
- **Email**: support@whatsappsuperbot.com
- **Telegram**: @whatsappsuperbot
- **Discord**: WhatsApp Super Bot Community

## 🙏 Recognition

Kontributor akan diakui di:
- [Contributors](https://github.com/yourusername/whatsapp-super-bot/graphs/contributors) page
- README.md contributors section
- Release notes

---

**Terima kasih telah berkontribusi pada WhatsApp Super Bot! 🚀** 