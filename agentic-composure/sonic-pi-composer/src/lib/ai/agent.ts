// Simple Agentic Sonic Pi code generation using AI SDK 5
// Uses production-grade structured prompts with bulletproof validation

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { buildMusicGenerationPrompt, buildSyntaxCleanupPrompt, buildMusicModificationPrompt, type StyleType } from './prompts';

// Syntax cleanup agent - uses production-grade structured prompts
async function cleanupSyntax(code: string): Promise<string> {
  try {
    const result = await generateText({
      model: openai('gpt-4.1'),
      system: buildSyntaxCleanupPrompt(code),
      prompt: `Apply syntax fixes to the provided code.`,
      maxTokens: 1200, 
    });

    return result.text.trim();
  } catch (error) {
    console.error('Syntax cleanup failed:', error);
    // If cleanup fails, return original code
    return code;
  }
}

export async function generateWithAgent(
  prompt: string, 
  style: StyleType = 'custom'
): Promise<{
  success: boolean;
  code: string;
  method: string;
  error?: string;
}> {
  try {
    // Step 1: Generate music with production-grade structured prompt
    const musicResult = await generateText({
      model: openai('gpt-4.1'),
      system: buildMusicGenerationPrompt(prompt, style),
      prompt: `Generate Sonic Pi code for the request above.`,
      maxTokens: 1000,
    });

    // Step 2: Clean up syntax without changing musical content
    const cleanedCode = await cleanupSyntax(musicResult.text.trim());

    return {
      success: true,
      code: cleanedCode,
      method: 'agentic-with-docs + syntax-cleanup (production-grade)'
    };
  } catch (error) {
    console.error('Agent generation failed:', error);
    return {
      success: false,
      code: '',
      method: 'agentic-with-docs + syntax-cleanup (production-grade)',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function modifyWithAgent(
  currentCode: string,
  modificationRequest: string
): Promise<{
  success: boolean;
  code: string;
  method: string;
  error?: string;
}> {
  try {
    // Step 1: Modify music with specialized modification prompt
    const modifyResult = await generateText({
      model: openai('gpt-4.1'),
      system: buildMusicModificationPrompt(currentCode, modificationRequest),
      prompt: `Apply the requested modifications to the provided Sonic Pi code.`,
      maxTokens: 1200,
    });

    // Step 2: Clean up syntax without changing musical content
    const cleanedCode = await cleanupSyntax(modifyResult.text.trim());

    return {
      success: true,
      code: cleanedCode,
      method: 'modify-agent + syntax-cleanup (production-grade)'
    };
  } catch (error) {
    console.error('Modify agent failed:', error);
    return {
      success: false,
      code: '',
      method: 'modify-agent + syntax-cleanup (production-grade)',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 