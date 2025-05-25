# Sonic Pi AI Composer - Next.js

A modern Next.js application for generating and executing Sonic Pi music code with AI, migrated from Python/Streamlit architecture.

## 🎵 Features

- **AI-Powered Music Generation**: Natural language to Sonic Pi code using GPT-4
- **Real-time Code Execution**: Direct integration with Sonic Pi server
- **Example Library**: Categorized collection of proven Sonic Pi patterns
- **Modern UI**: Built with Next.js, TypeScript, and shadcn/ui components
- **Generation History**: Save and replay your AI-generated music
- **Professional Prompt Engineering**: Validated syntax and musical structure

## 🏗️ Architecture

```
[Next.js Frontend + shadcn/ui] → [Next.js API Routes] → [Node.js Sonic Pi Service] → [Sonic Pi Server] → [Audio Output]
```

## 🚀 Quick Start

### Prerequisites

1. **Sonic Pi Application** - Download and install from [sonic-pi.net](https://sonic-pi.net/)
2. **Node.js 18+** - For Next.js development
3. **OpenAI API Key** - For AI code generation

### Installation

1. **Clone and Install**
   ```bash
   cd sonic-pi-composer
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your OpenAI API key
   ```

3. **Start Sonic Pi**
   - Launch Sonic Pi application
   - Ensure it's running on localhost:4560 (default)
   - Wait for full initialization (8 seconds required)

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/           # Main application routes
│   │   ├── page.tsx          # AI Composer interface
│   │   ├── examples/         # Example library
│   │   └── history/          # Generation history
│   ├── api/                  # Next.js API routes
│   │   ├── generate/         # AI code generation
│   │   ├── play/             # Sonic Pi execution
│   │   └── examples/         # Example management
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── composer/             # AI composer components
│   ├── examples/             # Example browser components
│   └── layout/               # Layout components
├── lib/
│   ├── sonic-pi/             # Sonic Pi integration
│   ├── ai/                   # OpenAI integration
│   └── utils/                # Utility functions
└── services/
    └── sonic-pi-bridge.js    # Node.js Sonic Pi bridge
```

## 🔧 Development Status

This project is currently scaffolded with the complete file structure. Implementation phases:

### ✅ Phase 1: Foundation (Completed)
- [x] Next.js project setup with TypeScript
- [x] shadcn/ui integration and configuration
- [x] Complete file structure scaffolding
- [x] Environment configuration
- [x] Dependency management

### 🚧 Phase 2: Core Services (In Progress)
- [ ] Convert AI prompts from Python (`prompts.py` → `lib/ai/prompts.ts`)
- [ ] Implement OpenAI integration (`lib/ai/generation.ts`)
- [ ] Refactor Node.js Sonic Pi bridge (`services/sonic-pi-bridge.js`)
- [ ] Create API routes (`app/api/*/route.ts`)

### 📋 Phase 3: Frontend Components (Planned)
- [ ] AI Prompt Input component
- [ ] Monaco Code Editor with Sonic Pi syntax
- [ ] Playback Controls with status indicators
- [ ] Generation History management
- [ ] Example Library browser

### 📋 Phase 4: Integration (Planned)
- [ ] Connect frontend to API routes
- [ ] Implement state management
- [ ] Add error handling and validation
- [ ] Test end-to-end functionality

### 📋 Phase 5: Polish (Planned)
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Deployment configuration
- [ ] Documentation completion

## 🔌 Integration Points

### Sonic Pi Bridge Service
The core integration maintains the critical 8-second audio initialization requirement:

```javascript
// services/sonic-pi-bridge.js
class SonicPiBridge {
  async initialize() {
    await this.waitForSonicPi(8000); // Critical timing requirement
    this.isInitialized = true;
  }
}
```

### AI Generation Flow
```
User Input → API Route → OpenAI → Validation → Response
```

### Audio Execution Flow
```
Generated Code → Validation → Sonic Pi Bridge → Audio Output
```

## 🛠️ Migration Notes

This project migrates from:
- **Python/Streamlit** → **Next.js/TypeScript**
- **Hardcoded UI** → **shadcn/ui Components**
- **Monolithic Structure** → **API Routes + Components**
- **Python AI Logic** → **TypeScript AI Integration**

Key files being converted:
- `streamlit_sonic_pi_ai.py` (351 lines) → React components
- `prompts.py` (218 lines) → TypeScript modules
- `enhanced_sonic_pi_ai.js` (587 lines) → Refactored service

## 🔒 Environment Variables

Required in `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
SONIC_PI_PATH=/Applications/Sonic Pi.app/Contents/Resources
SONIC_PI_HOST=localhost
SONIC_PI_PORT=4560
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚨 Critical Requirements

1. **Sonic Pi Must Be Running**: The application requires Sonic Pi to be launched and running
2. **8-Second Initialization**: Audio system needs 8 seconds to initialize properly
3. **OpenAI API Key**: Required for AI music generation
4. **Port 4560**: Ensure Sonic Pi server is accessible on localhost:4560

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Sonic Pi Documentation](https://sonic-pi.net/)
- [OpenAI API Reference](https://platform.openai.com/docs)

## 🤝 Contributing

1. Follow the existing file structure and naming conventions
2. Add TODO comments for incomplete implementations
3. Maintain TypeScript strict mode compliance
4. Test with actual Sonic Pi integration before submitting

---

*This Next.js application preserves all functionality from the original Python/Streamlit version while providing a modern, scalable architecture for future enhancements.*
