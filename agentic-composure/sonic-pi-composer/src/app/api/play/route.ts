// Sonic Pi execution endpoint
// TODO: Interface with Sonic Pi bridge service

import { NextRequest, NextResponse } from 'next/server';

// Check if we're in a production environment where Sonic Pi won't be available
function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production' && (
    process.env.VERCEL || 
    process.env.NETLIFY || 
    process.env.RAILWAY_ENVIRONMENT ||
    !process.platform.startsWith('darwin') // Not macOS
  );
}

function getProductionErrorResponse() {
  return NextResponse.json({
    success: false,
    message: 'Sonic Pi Composer requires a local Sonic Pi installation. This web app is designed to work with Sonic Pi running on your local machine, not on remote servers. Please run Sonic Pi locally and access this app from your local development environment.',
    isProduction: true,
    instructions: [
      '1. Install Sonic Pi from https://sonic-pi.net',
      '2. Launch Sonic Pi on your local machine',
      '3. Run this app locally (npm run dev)',
      '4. Or use the app from a local deployment'
    ]
  }, { status: 503 });
}

async function getSonicPiBridge() {
  if (isProductionEnvironment()) {
    throw new Error('Sonic Pi not available in production environment');
  }
  const mod = await import('../../../../services/sonic-pi-bridge.js');
  return mod.getSonicPiBridge();
}

export async function GET() {
  if (isProductionEnvironment()) {
    return getProductionErrorResponse();
  }

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
  if (isProductionEnvironment()) {
    return getProductionErrorResponse();
  }

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
  if (isProductionEnvironment()) {
    return getProductionErrorResponse();
  }

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
