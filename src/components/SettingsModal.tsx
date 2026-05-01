import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { apiKey, setApiKey, userName, userAvatar, updateProfile, theme, setTheme } = useStore();
  
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [inputName, setInputName] = useState(userName || '');
  const [inputAvatar, setInputAvatar] = useState(userAvatar || '');
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey || '');
      setInputName(userName || '');
      setInputAvatar(userAvatar || '');
      setCurrentTheme(theme);
    }
  }, [isOpen, apiKey, userName, userAvatar, theme]);

  const handleSave = () => {
    if (inputKey.trim() !== apiKey) {
      setApiKey(inputKey.trim());
    }
    updateProfile(inputName.trim() || 'User', inputAvatar.trim());
    setTheme(currentTheme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key (Pollinations)</Label>
            <Input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="text-sm"
              autoComplete="off"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="userAvatar">Avatar URL</Label>
            <Input
              id="userAvatar"
              value={inputAvatar}
              onChange={(e) => setInputAvatar(e.target.value)}
              placeholder="https://..."
              className="text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label>Theme</Label>
            <div className="flex bg-muted p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setCurrentTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${currentTheme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => setCurrentTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${currentTheme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setCurrentTheme('system')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${currentTheme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
