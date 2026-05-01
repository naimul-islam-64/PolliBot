import OpenAI from 'openai';

export const getPollinationsClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: 'https://text.pollinations.ai/openai',
    apiKey: apiKey || 'nexus-chat-key', // Fallback key just in case it bugs out (some APIs require any string)
    dangerouslyAllowBrowser: true,
  });
};
