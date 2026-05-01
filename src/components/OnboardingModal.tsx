import React, { useState } from 'react';
import { useStore } from '../store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const OnboardingModal = () => {
  const { apiKey, setApiKey } = useStore();
  const [inputKey, setInputKey] = useState('');
  
  // Show dialog if there's no API key
  const isOpen = !apiKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to PolliBot</DialogTitle>
          <DialogDescription>
            To get started, please enter your Pollinations API key. Your key is stored securely in your browser for 30 days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">Pollinations API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="col-span-3 text-sm"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!inputKey.trim()}>
              Save & Start Chatting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
