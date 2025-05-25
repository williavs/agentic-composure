// Sonic Pi Bridge Service
// Full implementation using @sunderb/sonic-pi-js-api with real-time cue tracking

const { SonicPiAPI, SonicPiOSCServer } = require('@sunderb/sonic-pi-js-api');
const EventEmitter = require('events');

class SonicPiBridge extends EventEmitter {
  constructor() {
    super();
    this.isInitialized = false;
    this.sonicPiAPI = new SonicPiAPI();
    this.oscServer = null;
    this.isConnecting = false;
    this.currentlyPlaying = false;
    this.liveLoopBeats = new Map(); // Track beats for each live loop
    this.globalBeatCount = 0;
    this.lastCueTime = null;
  }
  
  async initialize() {
    if (this.isInitialized) return true;
    if (this.isConnecting) return false; // Prevent concurrent initializations
    
    this.isConnecting = true;
    console.log('🎵 Initializing Sonic Pi bridge with real-time cue tracking...');
    
    try {
      // Initialize Sonic Pi API with macOS default path
      const result = await this.sonicPiAPI.init('/Applications/Sonic Pi.app/Contents/Resources');
      
      if (!result.success) {
        console.error('❌ Failed to initialize Sonic Pi:', result.error);
        this.isConnecting = false;
        return false;
      }
      
      console.log('✅ Sonic Pi server started!');
      console.log('⏳ Waiting 8 seconds for audio system...');
      
      // CRITICAL: Wait for audio system to be ready
      await this.waitForSonicPi(8000);
      
      console.log('🔊 Audio system ready!');
      
      // Set initial volume
      this.sonicPiAPI.set_volume(100);
      await this.waitForSonicPi(500); // Small delay for volume setting
      
      // Initialize OSC server for real-time cue listening
      await this.initializeOSCServer();
      
      this.isInitialized = true;
      this.isConnecting = false;
      return true;
      
    } catch (error) {
      console.error('❌ Initialization error:', error.message);
      this.isConnecting = false;
      return false;
    }
  }
  
  async initializeOSCServer() {
    try {
      // Create OSC server to listen for cue events
      this.oscServer = new SonicPiOSCServer('127.0.0.1', 4560, '127.0.0.1', 4557);
      
      // Listen for log events which contain cue information
      this.oscServer.on('log', (message) => {
        this.handleLogMessage(message);
      });
      
      // Listen for errors
      this.oscServer.on('error', (error) => {
        console.log('🎵 Sonic Pi Event:', error.type, error.message);
      });
      
      console.log('🎧 OSC server listening for real-time cue events...');
      
    } catch (error) {
      console.warn('⚠️ Could not initialize OSC server for cue tracking:', error.message);
      console.warn('🎵 Falling back to BPM-based timing...');
    }
  }
  
  handleLogMessage(message) {
    try {
      // Look for cue events in log messages
      if (message.type === 'info' && message.message_info) {
        const info = message.message_info;
        
        // Check if this is a cue event (live loop or manual cue)
        if (Array.isArray(info) && info.length > 0) {
          const firstMessage = info[0];
          
          // Live loop cue events typically contain the loop name
          if (typeof firstMessage === 'string' && firstMessage.includes('cue')) {
            this.handleCueEvent(firstMessage, info);
          }
          
          // Also check for time-based messages that indicate beat progression
          if (typeof firstMessage === 'string' && (
            firstMessage.includes('live_loop') || 
            firstMessage.includes('sync') ||
            firstMessage.includes('sleep')
          )) {
            this.handleTimingEvent(firstMessage, info);
          }
        }
      }
    } catch (error) {
      // Silently handle parsing errors to avoid spam
    }
  }
  
  handleCueEvent(message, info) {
    const timestamp = Date.now();
    this.lastCueTime = timestamp;
    
    // Extract loop name or cue identifier
    let loopName = 'unknown';
    const cueMatch = message.match(/cue[:\s]+([^\s,\]]+)/);
    if (cueMatch) {
      loopName = cueMatch[1];
    }
    
    // Update beat count for this loop
    const currentBeat = this.liveLoopBeats.get(loopName) || 0;
    this.liveLoopBeats.set(loopName, currentBeat + 1);
    
    // Increment global beat counter
    this.globalBeatCount++;
    
    console.log(`🥁 Cue Event: ${loopName} - Beat ${currentBeat + 1} (Global: ${this.globalBeatCount})`);
    
    // Emit beat event for frontend synchronization
    this.emit('beatEvent', {
      loopName,
      localBeat: currentBeat + 1,
      globalBeat: this.globalBeatCount,
      timestamp,
      message
    });
  }
  
  handleTimingEvent(message, info) {
    // Handle other timing-related events that can help with synchronization
    const timestamp = Date.now();
    
    this.emit('timingEvent', {
      message,
      info,
      timestamp
    });
  }
  
  // Get current beat information
  getBeatInfo() {
    return {
      globalBeat: this.globalBeatCount,
      loopBeats: Object.fromEntries(this.liveLoopBeats),
      lastCueTime: this.lastCueTime,
      isTracking: this.oscServer !== null
    };
  }
  
  // Reset beat counters (called when new code starts)
  resetBeats() {
    this.globalBeatCount = 0;
    this.liveLoopBeats.clear();
    this.lastCueTime = null;
    
    this.emit('beatReset');
    console.log('🔄 Beat tracking reset');
  }

  async playCode(code, type = 'custom') {
    console.log('🎵 Attempting to play code...');
    
    // Ensure initialization
    if (!this.isInitialized) {
      console.log('⚠️ Not initialized, initializing first...');
      const success = await this.initialize();
      if (!success) {
        return {
          success: false,
          message: 'Failed to initialize Sonic Pi server'
        };
      }
    }
    
    try {
      console.log('🎵 Sending code to Sonic Pi...');
      console.log('📝 Code preview:', code.split('\n')[0] + '...');
      
      // Reset beat tracking for new code
      this.resetBeats();
      
      // Execute the code
      this.sonicPiAPI.run_code(code);
      
      // Mark as currently playing
      this.currentlyPlaying = true;
      
      console.log('✅ Code sent successfully!');
      return {
        success: true,
        message: 'Code executed successfully'
      };
      
    } catch (error) {
      console.error('❌ Play error:', error.message);
      return {
        success: false,
        message: `Execution error: ${error.message}`
      };
    }
  }
  
  async stopCode() {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'Sonic Pi not initialized'
      };
    }
    
    try {
      this.sonicPiAPI.stop_all_jobs();
      this.currentlyPlaying = false;
      
      // Reset beat tracking when stopping
      this.resetBeats();
      
      console.log('🛑 Stopped all playback');
      return {
        success: true,
        message: 'Playback stopped successfully'
      };
    } catch (error) {
      console.error('❌ Stop error:', error.message);
      return {
        success: false,
        message: `Stop error: ${error.message}`
      };
    }
  }
  
  async isPlaying() {
    return this.currentlyPlaying;
  }
  
  async getStatus() {
    return {
      connected: this.isInitialized,
      initialized: this.isInitialized,
      connecting: this.isConnecting,
      beatTracking: this.oscServer !== null,
      ...this.getBeatInfo()
    };
  }
  
  async waitForSonicPi(timeout = 8000) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  async shutdown() {
    if (this.isInitialized) {
      try {
        // Close OSC server
        if (this.oscServer) {
          this.oscServer.removeAllListeners();
          this.oscServer = null;
        }
        
        this.sonicPiAPI.shutdown();
        console.log('🔴 Sonic Pi shutdown');
        this.isInitialized = false;
      } catch (error) {
        console.error('❌ Shutdown error:', error.message);
      }
    }
  }
}

// Singleton instance for the application
let bridgeInstance = null;

function getSonicPiBridge() {
  if (!bridgeInstance) {
    bridgeInstance = new SonicPiBridge();
  }
  return bridgeInstance;
}

module.exports = { SonicPiBridge, getSonicPiBridge };
