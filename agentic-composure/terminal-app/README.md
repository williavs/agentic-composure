# 🖥️ Terminal App - AI Music Agents

A Python-based terminal application for advanced AI music composition using intelligent agents and Sonic Pi integration.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![AI Agents](https://img.shields.io/badge/AI-Agents-green)
![Sonic Pi](https://img.shields.io/badge/Sonic%20Pi-Integration-orange)

## 🚀 Features

- **🤖 AI Music Agents**: Intelligent agents for music composition and generation
- **🗣️ Voice Integration**: Voice-controlled music creation and interaction
- **🤝 Multi-Agent System**: Collaborative AI music composition
- **📊 Advanced Analytics**: Detailed music generation analytics and insights
- **🎵 Sonic Pi Integration**: Direct integration with Sonic Pi for audio output
- **📝 Execution Logging**: Comprehensive logging of agent runs and outputs

## 🏗️ Project Structure

```
terminal-app/
├── music/                  # Music generation modules
├── runs/                   # Agent execution logs and outputs
├── venv/                   # Python virtual environment
├── openai_agents_docs/     # OpenAI agents documentation
├── new/                    # New experimental features
└── README.md              # This documentation
```

## 🚀 Quick Start

### Prerequisites

1. **Python 3.11+** - Required for the application
2. **Sonic Pi** - Download from [sonic-pi.net](https://sonic-pi.net)
3. **OpenAI API Key** - For AI music generation

### Installation

1. **Navigate to the terminal app directory**
   ```bash
   cd agentic-composure/terminal-app
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

5. **Launch Sonic Pi**
   - Open Sonic Pi application
   - Ensure it's running and ready to receive code

6. **Run the application**
   ```bash
   python main.py
   ```

## 🎯 Usage

### Basic Music Generation
```bash
python main.py --agent music_composer --prompt "ambient techno"
```

### Voice-Controlled Generation
```bash
python main.py --voice --agent music_composer
```

### Multi-Agent Collaboration
```bash
python main.py --multi-agent --agents "composer,arranger,mixer"
```

## 📊 Agent Runs

All agent executions are logged in the `runs/` directory with timestamps:
- **Input prompts** and parameters
- **Generated Sonic Pi code**
- **Execution logs** and errors
- **Performance metrics** and analytics

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
SONIC_PI_HOST=localhost
SONIC_PI_PORT=4560
```

### Agent Configuration
Agents can be configured through JSON configuration files in the project directory.

## 🤝 Contributing

This terminal app is part of the larger Agentic Composure project. See the main README for contribution guidelines.

**[📖 Read the Main Project README →](../README.md)**

## 📚 Documentation

- **[Main Project README](../README.md)** - Overview of all projects
- **[Sonic Pi Composer README](../sonic-pi-composer/README.md)** - Web application
- **[OpenAI Agents Docs](./openai_agents_docs/)** - Agent framework documentation

## 🐛 Troubleshooting

### Common Issues

**Python Environment Issues**
- Ensure Python 3.11+ is installed
- Activate the virtual environment before running
- Install all requirements with `pip install -r requirements.txt`

**Sonic Pi Connection**
- Verify Sonic Pi is running and initialized
- Check that OSC ports 4560/4557 are available
- Test connection with basic Sonic Pi commands

**Agent Execution Errors**
- Check OpenAI API key is set correctly
- Verify API credit balance
- Review logs in the `runs/` directory

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **[OpenAI Agents Framework](https://github.com/openai/openai-agents)** - Agent orchestration
- **[Sonic Pi](https://sonic-pi.net)** - Music synthesis and live coding
- **[Python](https://python.org)** - Programming language

---

**Part of the [Agentic Composure](../README.md) project** 