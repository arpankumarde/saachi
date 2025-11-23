import React from 'react';
import { Memory } from '../types';
import { Brain, RefreshCw, Cpu, Database } from 'lucide-react';

interface DevSpaceProps {
  ltm: Memory[];
  stm: Memory[];
  onRefresh: () => void;
}

const DevSpace: React.FC<DevSpaceProps> = ({ ltm, stm, onRefresh }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary p-5 h-full flex flex-col relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Brain className="w-32 h-32" />
      </div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="font-serif font-medium text-saachi-text flex items-center gap-2 text-lg">
          <Cpu className="w-5 h-5 text-saachi-accent" />
          Memory System
        </h3>
        <button onClick={onRefresh} className="p-2 hover:bg-saachi-secondary rounded-full text-stone-500 hover:text-saachi-primary transition-colors" title="Refresh Context">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 relative z-10">
        {/* Short Term Memory */}
        <div className="bg-white/50 rounded-xl p-1 border border-transparent hover:border-saachi-secondary/50 transition-colors">
          <h4 className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            Short Term Context (STM)
          </h4>
          <div className="space-y-2">
            {stm.length === 0 && <p className="text-xs text-stone-300 italic px-2">No active context.</p>}
            {stm.map(m => (
              <div key={m.id} className="bg-white p-3 rounded-lg border border-stone-100 text-xs text-stone-600 shadow-sm animate-fade-in-up">
                {m.content}
              </div>
            ))}
          </div>
        </div>

        {/* Long Term Memory */}
        <div className="bg-amber-50/30 rounded-xl p-1 border border-transparent hover:border-amber-100 transition-colors">
          <h4 className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">
            <Database className="w-3 h-3" />
            Long Term Facts (LTM)
          </h4>
          <div className="space-y-2">
            {ltm.length === 0 && <p className="text-xs text-stone-300 italic px-2">No long-term memories formed yet.</p>}
            {ltm.map(m => (
              <div key={m.id} className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-stone-700 shadow-sm flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">•</span> 
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-saachi-secondary/30 relative z-10">
        <div className="bg-stone-800 text-stone-300 p-3 rounded-lg text-[10px] font-mono shadow-inner">
           <div className="flex justify-between items-center mb-1">
             <span className="text-stone-500">Agent Status:</span>
             <span className="text-green-400">Online</span>
           </div>
           <div>Retrieval: Cosine Similarity</div>
        </div>
      </div>
    </div>
  );
};

export default DevSpace;