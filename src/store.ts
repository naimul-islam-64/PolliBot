import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';

export type Role = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  apiKey: string | null;
  keyExpiry: number | null;
  userName: string;
  userAvatar: string;
  theme: 'light' | 'dark' | 'system';
  chats: Chat[];
  currentChatId: string | null;
  activeStream: { chatId: string; content: string } | null;
  
  // Actions
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  updateProfile: (name: string, avatar: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  createChat: () => string;
  deleteChat: (id: string) => void;
  setCurrentChat: (id: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  deleteMessagesAfter: (chatId: string, messageId: string) => void;
  deleteLastMessage: (chatId: string) => void;
  setActiveStream: (stream: { chatId: string; content: string } | null) => void;
  appendStream: (chunk: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  clearConversations: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: null,
      keyExpiry: null,
      userName: 'User',
      userAvatar: '',
      theme: 'system',
      chats: [],
      currentChatId: null,
      activeStream: null,

      setApiKey: (key) => set({ 
        apiKey: key, 
        keyExpiry: addDays(new Date(), 30).getTime() 
      }),
      
      clearApiKey: () => set({ apiKey: null, keyExpiry: null }),
      
      updateProfile: (userName, userAvatar) => set({ userName, userAvatar }),
      
      setTheme: (theme) => set({ theme }),

      createChat: () => {
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
        return newChat.id;
      },

      deleteChat: (id) => set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        currentChatId: state.currentChatId === id ? null : state.currentChatId,
      })),

      setCurrentChat: (id) => set({ currentChatId: id }),

      addMessage: (chatId, message) => set((state) => {
        const chats = state.chats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { ...message, id: uuidv4(), createdAt: Date.now() },
              ],
              updatedAt: Date.now(),
            };
          }
          return chat;
        });
        return { chats };
      }),

      updateMessage: (chatId, messageId, content) => set((state) => ({
        chats: state.chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages.map(m => m.id === messageId ? { ...m, content } : m),
              updatedAt: Date.now()
            };
          }
          return chat;
        })
      })),

      deleteMessagesAfter: (chatId, messageId) => set((state) => ({
        chats: state.chats.map(chat => {
          if (chat.id === chatId) {
            const index = chat.messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
              return {
                ...chat,
                messages: chat.messages.slice(0, index + 1),
                updatedAt: Date.now()
              };
            }
          }
          return chat;
        })
      })),

      deleteLastMessage: (chatId) => set((state) => ({
        chats: state.chats.map(chat => {
          if (chat.id === chatId && chat.messages.length > 0) {
            return {
              ...chat,
              messages: chat.messages.slice(0, -1),
              updatedAt: Date.now()
            };
          }
          return chat;
        })
      })),

      setActiveStream: (stream) => set({ activeStream: stream }),

      appendStream: (chunk) => set((state) => ({
        activeStream: state.activeStream ? {
          ...state.activeStream,
          content: state.activeStream.content + chunk
        } : null
      })),

      updateChatTitle: (chatId, title) => set((state) => ({
        chats: state.chats.map((chat) => 
          chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat
        )
      })),

      clearConversations: () => set({ chats: [], currentChatId: null }),
    }),
    {
      name: 'nexus-chat-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['activeStream'].includes(key))
      ) as AppState,
    }
  )
);
