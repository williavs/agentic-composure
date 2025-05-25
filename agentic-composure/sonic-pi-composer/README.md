# 🎵 Sonic Pi Composer

An AI-powered web application for generating and playing music using Sonic Pi. Describe your music in natural language and watch AI create beautiful Sonic Pi code that plays instantly.

![Sonic Pi Composer](https://img.shields.io/badge/Sonic%20Pi-AI%20Composer-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.8-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- **🤖 AI Music Generation**: Describe music in natural language ("chill lofi beats", "driving techno") and get valid Sonic Pi code
- **🎮 Instant Playback**: Generated code automatically plays in your local Sonic Pi installation
- **📊 Live Visualizer**: Real-time visualization of beats, loops, and music structure with fullscreen mode
- **💻 Code Editor**: Syntax-highlighted editor for fine-tuning generated Sonic Pi code
- **🎛️ Interactive Sequencer**: Visual sequencer with beat tracking and loop management
- **📚 Built-in Examples**: Curated collection of Sonic Pi patterns and techniques

## 🚀 Quick Start

### Prerequisites

1. **Sonic Pi** - Download and install from [sonic-pi.net](https://sonic-pi.net)
2. **Node.js** - Version 18 or higher
3. **Modern web browser** - Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/williavs/agentic-composure.git
   cd agentic-composure/sonic-pi-composer
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key to .env.local
   ```

4. **Launch Sonic Pi**
   - Open Sonic Pi application
   - Ensure it's running and ready to receive code

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start creating music!

## 🎯 Usage

### AI Composer
1. Navigate to **Dashboard > Compose**
2. Describe your desired music style in the prompt field
3. Click **Generate** to create Sonic Pi code
4. The code will automatically play in Sonic Pi (if auto-play is enabled)
5. Edit the generated code in the built-in editor
6. Use **Play/Stop** controls to test your music

### Live Sequencer
1. Go to **Dashboard > Sequencer**
2. Write or paste Sonic Pi code in the editor
3. Watch the real-time visualizer show beats and loops
4. Click the **fullscreen** button for an immersive visualization experience
5. Use the sequencer controls to manage playback

### Example Prompts
- "Create a chill lofi hip hop beat with vinyl crackle"
- "Generate an upbeat techno track with acid bass"
- "Make ambient soundscape with reverb and delay"
- "Create a drum and bass pattern with breakbeats"

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Sonic Pi Integration**: @sunderb/sonic-pi-js-api
- **AI**: OpenAI GPT models for code generation
- **Real-time**: OSC (Open Sound Control) for beat tracking

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (play, generate, etc.)
│   ├── dashboard/         # Main application pages
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── composer/         # AI composer components
│   ├── sequencer/        # Sequencer and visualizer
│   └── ui/              # Reusable UI components
├── contexts/             # React contexts (NowPlaying, etc.)
├── lib/                  # Utilities and configurations
└── services/             # Sonic Pi bridge service
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:

```env
# OpenAI API Key (required for AI generation)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Customize AI model
OPENAI_MODEL=gpt-4

# Optional: Development settings
NODE_ENV=development
```

### Sonic Pi Setup
- Ensure Sonic Pi is installed at the default location:
  - **macOS**: `/Applications/Sonic Pi.app/Contents/Resources`
  - **Windows**: `C:\Program Files\Sonic Pi\`
  - **Linux**: `/usr/bin/sonic-pi`

## 🌐 Deployment

### Local Development
This app is designed to work with a local Sonic Pi installation. For full functionality:

1. Run Sonic Pi locally
2. Run the Next.js app locally (`npm run dev`)
3. Access at `localhost:3000`

### Production Deployment
When deployed to hosting services (Vercel, Netlify, etc.), the app will:
- Show helpful messages about requiring local Sonic Pi
- Disable playback controls gracefully
- Provide links to download Sonic Pi and clone the repo
- Still allow code generation and editing

## 🎼 Sonic Pi Integration

This app uses the [sonic-pi-js-api](https://github.com/sunderb/sonic-pi-js-api) library to:
- Send code to Sonic Pi for execution
- Receive real-time cue events for beat tracking
- Monitor playback status
- Control volume and playback

### Beat Tracking
The visualizer tracks beats through:
- OSC cue events from Sonic Pi
- Live loop synchronization
- Real-time beat counting
- Visual feedback for rhythm patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Sonic Pi](https://sonic-pi.net)** - The incredible live coding music environment by Sam Aaron
- **[sonic-pi-js-api](https://github.com/sunderb/sonic-pi-js-api)** - JavaScript API for Sonic Pi integration
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful and accessible UI components
- **[OpenAI](https://openai.com)** - AI models for music code generation

## 🐛 Troubleshooting

### Common Issues

**"Failed to start Sonic Pi server"**
- Ensure Sonic Pi is installed and at the correct path
- Try restarting Sonic Pi
- Check that no other applications are using the OSC ports

**"No audio output"**
- Verify your audio device is working
- Check Sonic Pi's audio settings
- Ensure volume is turned up in both Sonic Pi and your system

**"Code generation fails"**
- Check your OpenAI API key in `.env.local`
- Verify you have API credits available
- Try a simpler prompt

**"Visualizer not updating"**
- Ensure your Sonic Pi code includes `cue` commands or live loops
- Check that OSC communication is working
- Try restarting both applications

### Getting Help

- 📖 Check the [Sonic Pi documentation](https://sonic-pi.net/tutorial.html)
- 💬 Join the [Sonic Pi community](https://in-thread.sonic-pi.net/)
- 🐛 Report issues on [GitHub](https://github.com/williavs/agentic-composure/issues)

---

**Made with ❤️ for the Sonic Pi community**
