// Parse Sonic Pi code to extract structure
export interface CodeStructure {
  liveLoops: string[];
  samples: string[];
  notes: string[];
  bpm: number;
  sleeps: number[];
}

export function parseCodeStructure(code: string): CodeStructure {
  const liveLoopMatches = code.match(/live_loop\s+:(\w+)/g) || [];
  const sampleMatches = code.match(/sample\s+:(\w+)/g) || [];
  const playMatches = code.match(/play\s+(\d+)/g) || [];
  const bpmMatch = code.match(/use_bpm\s+(\d+)/);
  const sleepMatches = code.match(/sleep\s+([\d.]+)/g) || [];

  return {
    liveLoops: liveLoopMatches.map(match => match.replace('live_loop :', '')),
    samples: sampleMatches.map(match => match.replace('sample :', '')),
    notes: playMatches.map(match => match.replace('play ', '')),
    bpm: bpmMatch ? parseInt(bpmMatch[1]) : 120,
    sleeps: sleepMatches.map(match => parseFloat(match.replace('sleep ', '')))
  };
} 