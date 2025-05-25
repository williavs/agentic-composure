// AI code modification endpoint - specialized agent for modifying existing Sonic Pi code

import { NextRequest, NextResponse } from 'next/server';
import { modifyWithAgent } from '@/lib/ai/agent';

export async function POST(req: NextRequest) {
  try {
    const { currentCode, modificationRequest }: { 
      currentCode: string; 
      modificationRequest: string; 
    } = await req.json();
    
    if (!currentCode?.trim()) {
      return NextResponse.json(
        { success: false, error: 'No current code provided' },
        { status: 400 }
      );
    }
    
    if (!modificationRequest?.trim()) {
      return NextResponse.json(
        { success: false, error: 'No modification request provided' },
        { status: 400 }
      );
    }
    
    console.log('🎼 Using modify agent to transform existing code...');
    const modifyResult = await modifyWithAgent(currentCode, modificationRequest);
    console.log('🎼 Modify result:', { 
      success: modifyResult.success, 
      method: modifyResult.method,
      originalLength: currentCode.length,
      modifiedLength: modifyResult.code?.length || 0,
      error: modifyResult.error 
    });
    
    return NextResponse.json(modifyResult);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
} 