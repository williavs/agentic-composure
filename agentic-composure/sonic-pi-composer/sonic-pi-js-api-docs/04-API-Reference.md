# Sonic Pi JavaScript API Reference

## Core Methods for Integration

### SonicPiAPI Class

#### Initialization
```javascript
const sonicPi = new SonicPiAPI();
await sonicPi.init(root);  // Initialize server
await sonicPi.shutdown(); // Shutdown server
```

#### Code Execution
```javascript
await sonicPi.runCode(code);           // Execute Sonic Pi code
await sonicPi.stopAllJobs();          // Stop all running code
```

#### Settings Management
```javascript
sonicPi.settings = {
  log_synths: true,                    // Log synth messages
  log_cues: true,                      // Log cue messages  
  enable_external_synths: false,      // Enable external synths
  enforce_timing_guarantees: false,   // Enforce timing
  check_args: false,                   // Check arguments
  default_midi_channel: -1            // Default MIDI channel (-1 = all)
};
```

#### Buffer/Workspace Management
```javascript
await sonicPi.saveAndPlayBuffer(fileName, code);      // Save and play buffer
await sonicPi.saveWorkspace(workspacePath);           // Save workspace
await sonicPi.bufferNewLineAndIndent(pointLine, pointIndex, firstLine, code, fileName);
```

#### Volume Control
```javascript
await sonicPi.setMainVolume(volume);   // Set main volume (0.0 - 1.0)
```

## Events (SonicPiOSCServer)

### Available Events
- `received_ports` - When ports are received
- `shutdown_complete` - When shutdown is complete
- `ack` - Acknowledgment messages
- `error` - Error messages  
- `exited` - When server exits
- `log` - Log messages

### Event Handling
```javascript
const oscServer = new SonicPiOSCServer();

oscServer.on('log', (message) => {
    console.log('Sonic Pi Log:', message);
});

oscServer.on('error', (error) => {
    console.error('Sonic Pi Error:', error);
});

oscServer.on('ack', (ack) => {
    console.log('Command acknowledged:', ack);
});
```

## Integration Pattern for Python

### Basic Node.js Wrapper
```javascript
// sonic-pi-wrapper.js
const { SonicPiAPI } = require('@sunderb/sonic-pi-js-api');

class SonicPiWrapper {
    constructor() {
        this.api = new SonicPiAPI();
        this.isInitialized = false;
    }
    
    async init() {
        if (!this.isInitialized) {
            await this.api.init();
            this.isInitialized = true;
        }
    }
    
    async runCode(code) {
        await this.init();
        return await this.api.runCode(code);
    }
    
    async stop() {
        return await this.api.stopAllJobs();
    }
    
    async shutdown() {
        if (this.isInitialized) {
            await this.api.shutdown();
            this.isInitialized = false;
        }
    }
}

// Command line interface
const wrapper = new SonicPiWrapper();
const command = process.argv[2];
const code = process.argv[3];

switch(command) {
    case 'run':
        wrapper.runCode(code).then(() => process.exit(0));
        break;
    case 'stop':
        wrapper.stop().then(() => process.exit(0));
        break;
    case 'shutdown':
        wrapper.shutdown().then(() => process.exit(0));
        break;
}
```

### Python Integration
```python
import subprocess
import json

class SonicPiExecutor:
    def __init__(self):
        self.wrapper_path = "sonic-pi-wrapper.js"
    
    async def run_code(self, code: str):
        """Execute Sonic Pi code using Node.js wrapper"""
        result = subprocess.run([
            'node', self.wrapper_path, 'run', code
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            raise Exception(f"Sonic Pi execution failed: {result.stderr}")
        
        return result.stdout
    
    async def stop_all(self):
        """Stop all running Sonic Pi jobs"""
        subprocess.run(['node', self.wrapper_path, 'stop'])
    
    async def shutdown(self):
        """Shutdown Sonic Pi server"""
        subprocess.run(['node', self.wrapper_path, 'shutdown'])
```

## Key Features Available

✅ **Ready for Integration:**
- Server boot/shutdown
- Code execution  
- Job stopping
- Volume control
- Event logging

🚧 **Partial Support:**
- Workspace management
- Error handling
- MIDI options

❌ **Not Available:**
- Recording functionality
- Safe mode
- Link synchronization 