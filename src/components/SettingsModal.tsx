import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={currentTheme === t ? 'default' : 'outline'}
                  onClick={() => setCurrentTheme(t)}
                  className="w-full capitalize text-xs"
                >
                  {t}
                </Button>
              ))}
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
