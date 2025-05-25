// API Route for Real-time Beat Information
// Provides current beat position and loop synchronization data

import { NextRequest, NextResponse } from 'next/server';

// This would normally import from our bridge service
// For now, we'll implement a mock that can be replaced with real data
interface BeatInfo {
  globalBeat: number;
  loopBeats: Record<string, number>;
  lastCueTime: number | null;
  isTracking: boolean;
  timestamp: number;
}

let mockBeatInfo: BeatInfo = {
  globalBeat: 0,
  loopBeats: {},
  lastCueTime: null,
  isTracking: false,
  timestamp: Date.now()
};

export async function GET() {
  try {
    // In a real implementation, this would get data from the Sonic Pi bridge
    // const bridge = getSonicPiBridge();
    // const beatInfo = bridge.getBeatInfo();
    
    // For now, return mock data that simulates beat progression
    const currentTime = Date.now();
    
    // Mock beat progression (this will be replaced with real cue events)
    if (mockBeatInfo.lastCueTime && currentTime - mockBeatInfo.lastCueTime > 500) {
      mockBeatInfo.globalBeat += 1;
      mockBeatInfo.lastCueTime = currentTime;
    }
    
    const response: BeatInfo = {
      ...mockBeatInfo,
      timestamp: currentTime
    };
    
    return NextResponse.json({
      success: true,
      beatInfo: response
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get beat information';
    return NextResponse.json(
      { 
        success: false, 
        error: message
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { reset } = await req.json();
    
    if (reset) {
      // Reset beat tracking
      mockBeatInfo = {
        globalBeat: 0,
        loopBeats: {},
        lastCueTime: Date.now(),
        isTracking: true,
        timestamp: Date.now()
      };
      
      return NextResponse.json({
        success: true,
        message: 'Beat tracking reset'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid request'
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update beat information';
    return NextResponse.json(
      { 
        success: false, 
        error: message
      },
      { status: 500 }
    );
  }
} 