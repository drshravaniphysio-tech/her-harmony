import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User as UserIcon, Bot, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { ChatMessage } from '../../types';

export default function Companion({ user }: { user: User }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input.trim() }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.parts[0].text,
          history: messages,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: data.text }] },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: "I'm so sorry, I'm having a little trouble connecting right now. Can we try again in a moment?" }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-lavender-100 p-2 rounded-2xl">
          <Bot className="w-6 h-6 text-lavender-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Your AI Wellness Friend</h1>
          <p className="text-sm text-slate-500">I'm here to listen, support, and guide you.</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 text-slate-400">
            <Sparkles className="w-12 h-12 mb-4 text-lavender-300" />
            <p className="max-w-xs">
              "How are you feeling today? You can tell me anything - I'm here to support you."
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-slate-800" : "bg-lavender-100"
            )}>
              {msg.role === 'user' ? (
                <UserIcon className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-lavender-600" />
              )}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-slate-800 text-white rounded-tr-none" 
                : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none"
            )}>
              <div className="markdown-body">
                <ReactMarkdown>
                  {msg.parts[0].text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-lavender-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-lavender-400" />
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Talk to your friend..."
          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-lavender-500 focus:border-transparent outline-none transition-all min-h-[60px] max-h-[150px] shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-lavender-600 text-white p-2.5 rounded-xl hover:bg-lavender-700 disabled:opacity-50 transition-colors shadow-lg shadow-lavender-100"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
