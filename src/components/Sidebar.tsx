import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Trash2, Settings, Menu, Edit2, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import clsx from 'clsx';

interface SidebarProps {
  onOpenSettings: () => void;
  isMobile?: boolean;
}

const SidebarContent = ({ onOpenSettings }: { onOpenSettings: () => void }) => {
  const { chats, currentChatId, createChat, setCurrentChat, deleteChat, updateChatTitle, userName, userAvatar } = useStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const startEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = (e: React.FormEvent | React.KeyboardEvent | React.FocusEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      updateChatTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30 border-r">
      <div className="p-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-background"
          onClick={() => createChat()}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-1">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className={clsx(
              "group flex items-center justify-between px-2 py-2 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors text-sm",
              currentChatId === chat.id ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground"
            )}
            onClick={() => setCurrentChat(chat.id)}
          >
            {editingId === chat.id ? (
              <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                <MessageSquare className="w-4 h-4 shrink-0" />
                <input
                  ref={inputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={(e) => saveEdit(e, chat.id)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') saveEdit(e, chat.id);
                     if (e.key === 'Escape') cancelEdit(e as any);
                  }}
                  className="flex-1 min-w-0 bg-background border px-2 py-0.5 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button onPointerDown={(e) => { e.preventDefault(); saveEdit(e as any, chat.id); }} className="p-1 hover:text-primary"><Check className="w-3 h-3" /></button>
                <button onPointerDown={(e) => { e.preventDefault(); cancelEdit(e as any); }} className="p-1 hover:text-destructive"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <div className="truncate text-xs">{chat.title}</div>
                </div>
                <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1 hover:text-foreground transition-colors"
                    onClick={(e) => startEdit(e, chat.id, chat.title)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    className="p-1 hover:text-destructive transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 mt-auto border-t">
        <button 
          onClick={onOpenSettings}
          className="flex flex-row items-center gap-3 w-full p-2 hover:bg-secondary/50 rounded-md transition-colors text-left"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate">{userName}</div>
            <div className="text-xs text-muted-foreground">Settings</div>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </div>
    </div>
  );
};

export const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  return (
    <>
      <div className="hidden md:flex w-64 flex-col h-full">
         <SidebarContent onOpenSettings={onOpenSettings} />
      </div>
      
      <div className="md:hidden absolute top-3 left-3 z-50">
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent onOpenSettings={onOpenSettings} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
