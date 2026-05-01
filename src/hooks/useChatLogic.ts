import { useState, useRef } from 'react';
import { useStore, Message } from '../store';
import { getPollinationsClient } from '../lib/pollinations';
import OpenAI from 'openai';

export const useChatLogic = () => {
  const { 
    apiKey, 
    chats, 
    currentChatId, 
    addMessage, 
    updateChatTitle, 
    setActiveStream, 
    appendStream,
    deleteLastMessage,
    updateMessage,
    deleteMessagesAfter
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const processStream = async (chatId: string, messagesHistory: any[]) => {
    setIsLoading(true);
    setActiveStream({ chatId, content: '' });
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    let fullContent = '';

    try {
      const client = getPollinationsClient(apiKey!);
      
      const response = await client.chat.completions.create({
        model: 'openai',
        messages: messagesHistory,
        stream: true,
      }, { signal: controller.signal });

      for await (const chunk of response) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        if (chunkContent) {
          fullContent += chunkContent;
          appendStream(chunkContent);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error("Chat API Error:", error);
        fullContent += "\n\n*(Error: Could not complete response)*";
      }
    } finally {
      setIsLoading(false);
      setActiveStream(null);
      if (fullContent) {
        addMessage(chatId, { role: 'assistant', content: fullContent });
      }
      abortControllerRef.current = null;
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChatId || !apiKey || !content.trim()) return;

    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    if (chat.messages.length === 0) {
      updateChatTitle(currentChatId, content.length > 30 ? content.substring(0, 30) + '...' : content);
    }

    const messagesHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    messagesHistory.push({ role: 'user', content });
    addMessage(currentChatId, { role: 'user', content });

    await processStream(currentChatId, messagesHistory);
  };

  const regenerateResponse = async () => {
    if (!currentChatId || !apiKey) return;
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat || chat.messages.length === 0) return;

    // Remove the last assistant message if it exists
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg.role === 'assistant') {
      deleteLastMessage(currentChatId);
    }

    // Refresh context
    const updatedChat = useStore.getState().chats.find(c => c.id === currentChatId);
    if (!updatedChat) return;

    const messagesHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = updatedChat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    await processStream(currentChatId, messagesHistory);
  };

  const reSubmitMessage = async (messageId: string, newContent: string) => {
    if (!currentChatId || !apiKey || !newContent.trim()) return;
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    // Update message and delete everything after
    updateMessage(currentChatId, messageId, newContent);
    deleteMessagesAfter(currentChatId, messageId);

    // Refresh context
    const updatedChat = useStore.getState().chats.find(c => c.id === currentChatId);
    if (!updatedChat) return;

    const messagesHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = updatedChat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    await processStream(currentChatId, messagesHistory);
  };

  return { sendMessage, stopStreaming, regenerateResponse, reSubmitMessage, isLoading };
};
