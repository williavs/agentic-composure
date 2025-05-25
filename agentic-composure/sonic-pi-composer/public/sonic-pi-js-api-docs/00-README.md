# Sonic Pi JavaScript API Documentation

This directory contains scraped documentation from the [@sunderb/sonic-pi-js-api](https://sunderb.me/sonic-pi-js-api/latest/) package.

## Overview

The sonic-pi-js-api is an experimental JavaScript API to start and interact with the Sonic Pi server. It's compatible with Sonic Pi v4.x and provides programmatic access to Sonic Pi's capabilities.

## Documentation Structure

- `01-home.md` - Main package overview and feature matrix
- `02-SonicPiAPI.md` - Core SonicPiAPI class documentation  
- `03-SonicPiOSCServer.md` - OSC Server class documentation

## Key Components

### SonicPiAPI Class
The main class for interfacing with Sonic Pi server:
- Boot and shutdown server
- Run Sonic Pi code
- Handle workspaces/buffers
- Manage settings and options

### SonicPiOSCServer Class  
OSC communication layer:
- Handle OSC messages
- Event-driven architecture
- Log message handling

## Integration Possibilities

This JavaScript API could be integrated with our Python Sonic Pi agent to:
1. **Execute generated code directly** - Instead of just generating Sonic Pi code, we could run it
2. **Real-time feedback** - Get execution results and errors back to the AI
3. **Live coding capabilities** - Enable true live-coding AI agents
4. **Server management** - Programmatically start/stop Sonic Pi server

## Feature Matrix (from documentation)

| Feature                        | Status           |
| ------------------------------ | ---------------- |
| **Booting**                    |                  |
| Boot and initialise the server | ✅ Yes            |
| Shutdown the server            | ✅ Yes            |
| **Basic commands**             |                  |
| Run code                       | ✅ Yes            |
| Stop all jobs                  | ✅ Yes            |
| **Buffers/workspaces**         |                  |
| Load workspaces                | 🚧 Partial       |
| Save workspaces                | ✅ Yes (untested) |
| Save and play buffer           | ✅ Yes (untested) |
| Buffer new line and indent     | ✅ Yes (untested) |
| **Recordings**                 |                  |
| Start recording                | ❌ No             |
| Stop recording                 | ❌ No             |
| **Logging**                    |                  |
| Handle and emit log messages   | ✅ Yes            |
| Handle and emit errors         | 🚧 Partial       |
| **Options & IO**               |                  |
| Main volume                    | ✅ Yes            |
| Safe mode                      | ❌ No             |
| External synths                | ✅ Yes            |
| MIDI options                   | 🚧 Partial       |
| Link                           | ❌ No             |

## Next Steps for Python Integration

1. Use Node.js subprocess to run JS API
2. Create Python wrapper for the JS API 
3. Extend our SonicPiAgent to execute code directly
4. Add real-time feedback loops

## Installation

```bash
npm install @sunderb/sonic-pi-js-api
```

## Basic Usage Example

```javascript
const { SonicPiAPI } = require('@sunderb/sonic-pi-js-api');

const sonicPi = new SonicPiAPI();
await sonicPi.init();
await sonicPi.runCode('play 60');
await sonicPi.shutdown();
``` 