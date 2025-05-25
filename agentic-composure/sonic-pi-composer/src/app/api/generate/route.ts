// AI code generation endpoint with production-grade agentic approach

import { NextRequest, NextResponse } from 'next/server';
import { generateWithAgent } from '@/lib/ai/agent';
import { type StyleType } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style = 'custom' }: { 
      prompt: string; 
      style?: StyleType; 
    } = await req.json();
    
    console.log('🎵 Using production-grade agent with structured prompts...');
    const agentResult = await generateWithAgent(prompt, style);
    console.log('🎵 Agent result:', { 
      success: agentResult.success, 
      method: agentResult.method,
      codeLength: agentResult.code?.length || 0,
      error: agentResult.error 
    });
    
    return NextResponse.json(agentResult);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
