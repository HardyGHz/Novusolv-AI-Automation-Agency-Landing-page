import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, Calendar, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: number;
}

const MAX_CHARS = 500;

export const AIStrategistSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCTA, setShowCTA] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Creative loading messages
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const thinkingMessages = t('ai_assistant.thinking_messages', { returnObjects: true }) as string[];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % thinkingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, thinkingMessages.length]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('novu_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load chat history');
      }
    } else {
      // Initial greeting if no history
      const greeting = t('ai_assistant.initial_greeting');
      
      setMessages([{
        role: 'model',
        parts: [{ text: greeting }],
        timestamp: Date.now()
      }]);
    }
  }, [i18n.language, t]);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('novu_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: inputValue.trim() }],
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setThinkingIndex(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.parts[0].text,
          history: messages.map(m => ({ role: m.role, parts: m.parts }))
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to connect to Novu');

      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: data.text }],
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMessage]);
      
      if (data.intent === 'HIGH') {
        setShowCTA(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('novu_chat_history');
    window.location.reload();
  };

  const isInitialState = messages.length <= 1 && !isLoading && !error;

  return (
    <section className="w-full relative z-[3] py-20 pb-24">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {isInitialState ? (
            <motion.div
              key="minimal-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-10 min-h-[500px] justify-center"
            >
              <div className="text-center flex flex-col gap-4">
                <h2 className="text-[56px] leading-[110%] max-sm:text-[40px] font-bold bg-gradient-to-r from-white via-[#dcf8ff] to-[#e6dfff] bg-clip-text text-transparent">
                  {t('ai_assistant.section_title')}
                </h2>
                <p className="text-[20px] text-white/60 max-w-[600px] mx-auto font-medium">
                  {t('ai_assistant.section_subtitle')}
                </p>
              </div>

              {/* Minimal White Input Box */}
              <div className="w-full max-w-[750px] relative mt-4">
                <div className="absolute -inset-1 bg-white/5 blur-2xl rounded-full" />
                <div className="relative flex flex-col bg-[#ffffff] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#e5e7eb] p-2 group transition-all duration-300">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.slice(0, MAX_CHARS))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={t('ai_assistant.minimal_placeholder')}
                    className="w-full bg-transparent rounded-2xl px-6 py-5 text-[18px] text-[#111827] placeholder-[#9ca3af] focus:outline-none resize-none custom-scrollbar"
                    rows={1}
                    style={{ minHeight: '80px', maxHeight: '200px' }}
                  />
                  <div className="flex justify-between items-center px-6 pb-4">
                    <span className={clsx(
                      "text-[12px] font-semibold tracking-wide",
                      inputValue.length >= MAX_CHARS ? "text-red-500" : "text-gray-400"
                    )}>
                      {inputValue.length > 0 ? `${inputValue.length} / ${MAX_CHARS} CHARS` : ''}
                    </span>
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className={clsx(
                        "w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center",
                        inputValue.trim() 
                          ? "bg-[#111827] text-white hover:bg-[#1f2937] hover:scale-105 shadow-md" 
                          : "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed"
                      )}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="text-center flex flex-col gap-2">
                <h2 className="text-[28px] max-sm:text-[24px] text-white font-bold">
                  {t('ai_assistant.section_title')}
                </h2>
              </div>
              
              <div className="w-full max-w-[850px] h-[650px] max-sm:h-[550px] bg-[#0a0a0a]/80 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
                {/* Header */}
                <div className="p-4 lg:p-6 mb-2 bg-gradient-to-r from-purple-900/30 via-black to-blue-900/20 border-b border-white/5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center border-2 border-purple-500/30">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg tracking-tight">{t('ai_assistant.name')}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-green-400 font-bold tracking-widest uppercase">{t('ai_assistant.status')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scroll-smooth custom-scrollbar"
                >
                  {messages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={clsx(
                        "flex flex-col max-w-[80%] max-sm:max-w-[90%]",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div 
                        className={clsx(
                          "px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-lg",
                          msg.role === 'user' 
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm shadow-purple-900/30" 
                            : "bg-white/[0.03] text-gray-200 border border-white/10 rounded-tl-sm backdrop-blur-md"
                        )}
                      >
                        {msg.parts[0].text}
                      </div>
                      <span className="text-[11px] text-gray-500 mt-2 uppercase font-bold tracking-widest pl-1 pr-1">
                        {msg.role === 'user' ? 'You' : 'Novu'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                  
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 text-purple-400 text-sm font-medium mr-auto max-w-[80%] bg-purple-500/10 px-5 py-3 rounded-2xl border border-purple-500/20"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        {thinkingMessages[thinkingIndex] || t('ai_assistant.thinking')}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center mx-auto max-w-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* High Intent CTA */}
                {showCTA && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-t border-purple-500/20 flex justify-center backdrop-blur-sm"
                  >
                    <a 
                      href="#contact"
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/50 hover:scale-105 active:scale-95"
                    >
                      <Calendar className="w-5 h-5" />
                      {t('ai_assistant.book_call_cta')}
                    </a>
                  </motion.div>
                )}

                {/* Input Area */}
                <div className="p-4 lg:p-6 bg-white/[0.01] border-t border-white/5">
                  <div className="relative flex flex-col gap-2">
                    <div className="relative flex items-center">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.slice(0, MAX_CHARS))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder={t('ai_assistant.placeholder')}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-16 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none shadow-inner"
                        rows={1}
                        style={{ minHeight: '60px', maxHeight: '150px' }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-3 p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-widest",
                        inputValue.length >= MAX_CHARS ? "text-red-500" : "text-gray-600"
                      )}>
                        {inputValue.length} / {MAX_CHARS} CHARS
                      </span>
                      <button 
                        onClick={clearHistory}
                        className="text-[10px] text-gray-500 hover:text-red-400 uppercase font-bold tracking-widest transition-colors flex items-center gap-1"
                      >
                        {t('ai_assistant.reset')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIStrategistSection;
