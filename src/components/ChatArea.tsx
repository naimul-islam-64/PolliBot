import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { useChatLogic } from '../hooks/useChatLogic';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, Square, Copy, Edit2, RefreshCw, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-6 w-6 text-muted-foreground hover:text-foreground"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </Button>
  );
};

export const ChatArea = () => {
  const { chats, currentChatId, userName, userAvatar, activeStream } = useStore();
  const { sendMessage, stopStreaming, regenerateResponse, reSubmitMessage, isLoading } = useChatLogic();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === currentChatId);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, activeStream?.content, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      stopStreaming();
      return;
    }
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const submitEdit = () => {
    if (!editContent.trim()) {
      setEditingId(null);
      return;
    }
    reSubmitMessage(editingId!, editContent);
    setEditingId(null);
  };

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground p-8 max-w-sm">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-medium text-foreground mb-2">PolliBot</h2>
          <p className="text-sm">Select a chat from the sidebar or start a new one to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-0">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {currentChat?.messages.map((message, index) => {
          const isLastMessage = index === currentChat.messages.length - 1;
          const isLastUserMessage = message.role === 'user' && currentChat.messages.slice(index + 1).every(m => m.role !== 'user');

          return (
            <div key={message.id} className={clsx(
              "flex w-full gap-4 max-w-3xl mx-auto group",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 shrink-0 mt-1 ring-1 ring-border shadow-sm">
                  <div className="bg-primary flex items-center justify-center w-full h-full text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                </Avatar>
              )}
              
              <div className="flex flex-col relative max-w-[85%]">
                <div className={clsx(
                  "px-4 py-3 text-[15px] leading-relaxed",
                  message.role === 'user' 
                    ? "bg-transparent text-foreground px-0" 
                    : "bg-surface border bg-card text-card-foreground rounded-2xl rounded-tl-sm shadow-sm"
                )}>
                  {editingId === message.id ? (
                    <div className="flex flex-col gap-2 w-full min-w-[280px] bg-card border rounded-lg p-3 shadow-sm">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px] resize-y border-0 focus-visible:ring-0 p-0 shadow-none text-[15px]"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button size="sm" onClick={submitEdit}>Save & Submit</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="mt-4 mb-4 rounded-md overflow-hidden ring-1 ring-border">
                                  <div className="flex items-center px-4 py-2 bg-muted text-muted-foreground text-xs font-mono uppercase tracking-wider">
                                    {match[1]}
                                  </div>
                                  <SyntaxHighlighter
                                    style={oneDark as any}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers
                                    customStyle={{ margin: 0, borderRadius: 0, padding: '1rem' }}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code className="bg-muted px-1.5 py-0.5 rounded-sm text-[13px] font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>

                {!editingId && (
                  <div className={clsx(
                    "flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                    message.role === 'user' ? "justify-end" : "justify-start pl-2"
                  )}>
                    <CopyButton text={message.content} />
                    {isLastUserMessage && message.role === 'user' && !isLoading && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => startEdit(message.id, message.content)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    )}
                    {isLastMessage && message.role === 'assistant' && !isLoading && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={regenerateResponse}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8 shrink-0 mt-1 ring-1 ring-border shadow-sm">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}

        {/* Active Stream View */}
        {activeStream && activeStream.chatId === currentChatId && (
          <div className="flex w-full gap-4 max-w-3xl mx-auto justify-start">
            <Avatar className="w-8 h-8 shrink-0 mt-1 ring-1 ring-border shadow-sm">
              <div className="bg-primary flex items-center justify-center w-full h-full text-primary-foreground">
                <Bot className="w-4 h-4" />
              </div>
            </Avatar>
            <div className="px-4 py-3 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm bg-surface border bg-card text-card-foreground rounded-tl-sm">
               {activeStream.content ? (
                 <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                     {activeStream.content + "▮"}
                   </ReactMarkdown>
                 </div>
               ) : (
                <div className="flex items-center space-x-1.5 h-[24px]">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                </div>
               )}
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-4 bg-background">
        <div className="max-w-3xl mx-auto relative rounded-2xl border bg-card shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message PolliBot..."
            className="min-h-[56px] max-h-72 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent py-4 pl-4 pr-12 text-[15px]"
            rows={1}
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={(!input.trim() && !isLoading)}
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
          >
            {isLoading ? <Square className="w-4 h-4" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>
        <div className="text-center mt-2 px-4">
          <span className="text-[11px] text-muted-foreground">
            PolliBot uses Pollinations.ai API. Responses may contain inaccuracies.
          </span>
        </div>
      </div>
    </div>
  );
};
