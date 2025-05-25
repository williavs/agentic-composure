# 🎵 Agentic Composure

A collection of AI-powered music creation tools and applications, featuring intelligent agents for Sonic Pi composition and music generation.

![Agentic Composure](https://img.shields.io/badge/Agentic-Composure-purple)
![AI Music](https://img.shields.io/badge/AI-Music%20Generation-blue)
![Sonic Pi](https://img.shields.io/badge/Sonic%20Pi-Integration-green)

## 🚀 Projects

This monorepo contains multiple AI music creation applications:

### 🎹 [Sonic Pi Composer](./sonic-pi-composer/)
**Next.js Web Application for AI-Powered Music Generation**

A modern web interface for creating music with AI and Sonic Pi. Features real-time visualization, interactive sequencing, and natural language music generation.

- **🤖 AI Music Generation**: Describe music in natural language and get Sonic Pi code
- **📊 Live Visualizer**: Real-time beat tracking and music visualization
- **🎛️ Interactive Sequencer**: Visual sequencer with fullscreen mode
- **💻 Code Editor**: Syntax-highlighted Sonic Pi code editing

**[📖 Read the Sonic Pi Composer README →](./sonic-pi-composer/README.md)**

### 🖥️ [Terminal App](./terminal-app/)
**Python-based Terminal Application for Music Agents**

A command-line interface for running AI music agents with advanced capabilities including multi-agent orchestration and voice interaction.

- **🎵 AI Music Agents**: Intelligent agents for music composition
- **🗣️ Voice Integration**: Voice-controlled music generation
- **🤝 Multi-Agent System**: Collaborative AI music creation
- **📊 Advanced Analytics**: Music generation analytics and insights

**[📖 Read the Terminal App README →](./terminal-app/README.md)**

## 🏗️ Architecture

```
agentic-composure/
├── sonic-pi-composer/          # Next.js web application
│   ├── src/                   # React components and pages
│   ├── services/              # Sonic Pi integration
│   └── README.md             # Web app documentation
├── terminal-app/              # Python terminal application
│   ├── music/                # Music generation modules
│   ├── runs/                 # Agent execution logs
│   └── README.md             # Terminal app documentation
└── README.md                 # This overview document
```

## 🚀 Quick Start

### Prerequisites

1. **Sonic Pi** - Download from [sonic-pi.net](https://sonic-pi.net)
2. **Node.js 18+** - For the web application
3. **Python 3.11+** - For the terminal application
4. **OpenAI API Key** - For AI music generation

### Choose Your Interface

#### 🌐 Web Interface (Recommended for Beginners)
```bash
# Clone the repository
git clone https://github.com/williavs/agentic-composure.git
cd agentic-composure/sonic-pi-composer

# Install and run
npm install --legacy-peer-deps
npm run dev

# Open http://localhost:3000
```

#### 🖥️ Terminal Interface (Advanced Users)
```bash
# Navigate to terminal app
cd agentic-composure/terminal-app

# Set up Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the application
python main.py
```

## 🎯 Use Cases

### 🎵 Music Creation
- **Beginners**: Use the web interface to describe music and hear it instantly
- **Producers**: Generate ideas and export Sonic Pi code for further development
- **Live Coders**: Use the terminal app for advanced agent-based composition
- **Educators**: Teach music programming concepts with visual feedback

### 🤖 AI Development
- **Researchers**: Experiment with multi-agent music systems
- **Developers**: Extend the codebase with new AI music capabilities
- **Students**: Learn about AI agents in creative applications

## 🔧 Configuration

### Environment Variables
Both applications require similar environment setup:

```env
# Required for AI generation
OPENAI_API_KEY=your_openai_api_key_here

# Optional customization
OPENAI_MODEL=gpt-4
NODE_ENV=development
```

### Sonic Pi Setup
Ensure Sonic Pi is installed and running:
- **macOS**: `/Applications/Sonic Pi.app/Contents/Resources`
- **Windows**: `C:\Program Files\Sonic Pi\`
- **Linux**: `/usr/bin/sonic-pi`

## 🌐 Deployment

### Web Application
The Sonic Pi Composer can be deployed to any hosting service:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Self-hosted**

**Note**: Production deployments will show helpful messages about requiring local Sonic Pi installation.

### Terminal Application
The terminal app is designed for local development and research environments.

## 🤝 Contributing

We welcome contributions to both projects!

### Getting Started
1. Fork the repository
2. Choose your project: `sonic-pi-composer/` or `terminal-app/`
3. Create a feature branch
4. Make your changes
5. Submit a pull request

### Development Guidelines
- Follow the existing code style in each project
- Add tests for new features
- Update documentation as needed
- Test with actual Sonic Pi integration

## 📚 Documentation

- **[Sonic Pi Composer README](./sonic-pi-composer/README.md)** - Web application documentation
- **[Terminal App README](./terminal-app/README.md)** - Terminal application documentation
- **[Sonic Pi Documentation](https://sonic-pi.net/tutorial.html)** - Learn Sonic Pi
- **[OpenAI API Docs](https://platform.openai.com/docs)** - AI integration reference

## 🐛 Troubleshooting

### Common Issues

**Sonic Pi Connection Problems**
- Ensure Sonic Pi is running and initialized (wait 8 seconds after startup)
- Check that no other applications are using OSC ports 4560/4557
- Verify Sonic Pi installation path

**AI Generation Issues**
- Verify OpenAI API key is set correctly
- Check API credit balance
- Try simpler prompts if generation fails

**Audio Problems**
- Test audio output in Sonic Pi directly
- Check system audio settings
- Ensure proper audio device selection

### Getting Help

- 🐛 **Issues**: [GitHub Issues](https://github.com/williavs/agentic-composure/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/williavs/agentic-composure/discussions)
- 📖 **Sonic Pi Community**: [in-thread.sonic-pi.net](https://in-thread.sonic-pi.net/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Sonic Pi](https://sonic-pi.net)** - Sam Aaron and the Sonic Pi Core Team
- **[OpenAI](https://openai.com)** - AI models for music generation
- **[sonic-pi-js-api](https://github.com/sunderb/sonic-pi-js-api)** - JavaScript integration
- **[Next.js](https://nextjs.org)** - React framework
- **[shadcn/ui](https://ui.shadcn.com)** - UI components

## 🎵 Examples

### Web Interface
```
"Create a chill lofi hip hop beat with vinyl crackle"
→ Generates Sonic Pi code
→ Plays automatically
→ Shows real-time visualization
```

### Terminal Interface
```bash
python main.py --agent music_composer --prompt "ambient techno"
→ Multi-agent composition
→ Advanced analytics
→ Voice interaction support
```

---

**Made with ❤️ for the Sonic Pi and AI music community**

## 🔗 Quick Links

- 🌐 **[Try the Web App](./sonic-pi-composer/)** - Start creating music in your browser
- 🖥️ **[Terminal App](./terminal-app/)** - Advanced AI music agents
- 📖 **[Sonic Pi](https://sonic-pi.net)** - Download Sonic Pi
- 🤖 **[OpenAI](https://platform.openai.com)** - Get your API key 