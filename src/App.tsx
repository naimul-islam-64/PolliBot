import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { isPast } from 'date-fns';

export default function App() {
  const { theme, keyExpiry, clearApiKey, apiKey } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Check token expiry
  useEffect(() => {
    if (apiKey && keyExpiry) {
      if (isPast(new Date(keyExpiry))) {
        clearApiKey();
      }
    }
  }, [apiKey, keyExpiry, clearApiKey]);

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <ChatArea />
      
      <OnboardingModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
