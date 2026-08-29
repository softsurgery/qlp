import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';
import { chatApi } from '../lib/api';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [activeId, setActiveId] = useState(conversationId || '');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.getConversations().then((r) => r.data),
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', activeId],
    queryFn: () => chatApi.getMessages(activeId).then((r) => r.data),
    enabled: !!activeId,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(activeId, content),
    onSuccess: () => {
      setMessage('');
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  useEffect(() => {
    if (conversationId) setActiveId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    socketRef.current = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      auth: { token },
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeId || !socketRef.current) return;
    socketRef.current.emit('joinConversation', { conversationId: activeId });
    socketRef.current.on('newMessage', () => refetchMessages());
    return () => {
      socketRef.current?.off('newMessage');
    };
  }, [activeId, refetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeId) return;
    socketRef.current?.emit('sendMessage', { conversationId: activeId, content: message });
    sendMutation.mutate(message);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('chat.title')}</h1>
      <div className="flex border border-border rounded-xl overflow-hidden h-[600px]">
        <div className="w-72 border-e border-border bg-secondary overflow-y-auto">
          {conversations?.length ? conversations.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full p-4 text-start hover:bg-muted transition-colors border-b border-border ${
                activeId === c.id ? 'bg-muted' : ''
              }`}
            >
              <p className="font-medium text-sm">{c.participantName}</p>
              <p className="text-xs text-muted-foreground truncate">{c.lastMessage || 'No messages'}</p>
            </button>
          )) : (
            <p className="p-4 text-sm text-muted-foreground">{t('chat.noConversations')}</p>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          {activeId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages?.map((msg: any) => (
                  <div key={msg.id} className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {msg.sender?.firstName} — {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                    <p className="text-sm mt-1 p-2 bg-secondary rounded-lg inline-block max-w-md">{msg.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
                <input
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder={t('chat.placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="p-2 bg-primary text-primary-foreground rounded-lg">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
