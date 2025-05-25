// OpenAI client setup
// TODO: Configure OpenAI client with environment variables

import { openai } from '@ai-sdk/openai';

// Configure OpenAI client with environment variables
export const sonicPiModel = openai('gpt-4o', {
  structuredOutputs: true,
});

// Alternative models for different use cases
export const models = {
  // Primary model for code generation
  composer: openai('gpt-4o', { structuredOutputs: true }),
  
  // Faster model for validation and simple tasks
  validator: openai('gpt-4o-mini'),
  
  // Reasoning model for complex musical analysis
  analyzer: openai('o3-mini'),
} as const;

// Validate OpenAI API key is available
export function validateOpenAIKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Get model based on task type
export function getModelForTask(task: 'compose' | 'validate' | 'analyze' = 'compose') {
  return models[task === 'compose' ? 'composer' : task === 'validate' ? 'validator' : 'analyzer'];
}

// TODO: Export configured OpenAI client instance
// TODO: Add error handling for missing API key
// TODO: Add rate limiting configuration
