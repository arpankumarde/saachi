import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, User, Bot, AlertCircle } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-saachi-secondary bg-saachi-surface/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-saachi-primary text-white flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-medium text-saachi-text">Saachi</h2>
            <p className="text-xs text-stone-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Always here for you
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
          Powered by IBM
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 opacity-60">
            <Bot className="w-16 h-16 mb-3 text-stone-300" />
            <p className="font-serif text-lg">Start a conversation...</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
               <div className="w-8 h-8 rounded-full bg-saachi-secondary flex-shrink-0 flex items-center justify-center text-saachi-text">
                  <Bot className="w-4 h-4" />
               </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-saachi-primary text-white rounded-tr-none'
                  : 'bg-white text-saachi-text border border-stone-100 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-stone-200 flex-shrink-0 flex items-center justify-center text-stone-500">
                  <User className="w-4 h-4" />
               </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start gap-3">
             <div className="w-8 h-8 rounded-full bg-saachi-secondary flex-shrink-0 flex items-center justify-center text-saachi-text">
                  <Bot className="w-4 h-4" />
             </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-stone-100">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-saachi-secondary">
        <div className="flex items-end gap-2 bg-saachi-bg rounded-2xl p-2 border border-stone-200 focus-within:border-saachi-accent focus-within:ring-1 focus-within:ring-saachi-accent/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your thoughts here..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-3 text-saachi-text placeholder-stone-400 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              input.trim() && !isTyping
                ? 'bg-saachi-primary text-white hover:bg-saachi-accent shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="flex items-center justify-center gap-1 text-[10px] text-stone-400 mt-3">
          <AlertCircle className="w-3 h-3" />
          <span>Saachi AI can make mistakes. Not a substitute for professional help.</span>
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;