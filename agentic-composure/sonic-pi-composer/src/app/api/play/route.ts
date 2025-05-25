// Sonic Pi execution endpoint
// TODO: Interface with Sonic Pi bridge service

import { NextRequest, NextResponse } from 'next/server';

async function getSonicPiBridge() {
  const mod = await import('../../../../services/sonic-pi-bridge.js');
  return mod.getSonicPiBridge();
}

export async function GET() {
  try {
    const bridge = await getSonicPiBridge();
    const isPlaying = await bridge.isPlaying();
    return NextResponse.json({ isPlaying });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status check failed';
    return NextResponse.json(
      { isPlaying: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const bridge = await getSonicPiBridge();
    const result = await bridge.playCode(code);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const bridge = await getSonicPiBridge();
    const result = await bridge.stopCode();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Stop failed'
    }, { status: 500 });
  }
}
