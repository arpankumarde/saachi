import React from 'react';
import { MoodEntry } from '../types';
import { Activity, Smile, Frown } from 'lucide-react';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onLogMood: (score: number) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onLogMood }) => {
  const data = entries.slice(-7).map((e) => ({
    label: new Date(e.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
    score: e.score,
    timestamp: e.timestamp
  }));

  const getMoodColor = (score: number) => {
    if (score <= 2) return 'bg-stone-400';
    if (score === 3) return 'bg-stone-300';
    return 'bg-saachi-accent';
  };
  
  const getMoodHeight = (score: number) => {
      // score is 1-5
      return `${Math.max((score / 5) * 100, 10)}%`; // Minimum height for visibility
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary p-5 flex flex-col h-full min-h-[300px] relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="font-serif font-medium text-saachi-text flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-saachi-accent" />
            Mood Pulse
        </h3>
        <span className="text-xs text-stone-400 font-medium bg-white/50 px-2 py-1 rounded-full border border-saachi-secondary/30">Last 7 Days</span>
      </div>
      
      {/* Chart */}
      <div className="flex-1 w-full flex items-end justify-between gap-3 px-2 pb-2 z-10">
        {data.map((entry) => (
            <div key={entry.timestamp} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-default">
                <div className="w-full max-w-[40px] h-full flex items-end justify-center relative">
                    <div 
                        className={`w-full rounded-xl transition-all duration-700 ease-out ${getMoodColor(entry.score)} group-hover:opacity-80 group-hover:scale-y-105 origin-bottom shadow-sm`}
                        style={{ height: getMoodHeight(entry.score) }}
                    ></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                        {entry.score}/5
                    </div>
                </div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{entry.label}</span>
            </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-saachi-secondary/30 z-10">
        <div className="flex justify-between items-center px-1">
             <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <Frown className="w-3 h-3" /> Log today
             </span>
             <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <Smile className="w-3 h-3" />
             </span>
        </div>
        
        <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(score => (
                <button 
                    key={score}
                    onClick={() => onLogMood(score)}
                    className={`
                        flex-1 h-10 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm border
                        ${score >= 4 
                            ? 'bg-white text-saachi-accent border-saachi-accent/20 hover:bg-saachi-accent hover:text-white' 
                            : score === 3 
                                ? 'bg-white text-stone-500 border-stone-200 hover:bg-stone-200 hover:text-stone-700'
                                : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-300 hover:text-stone-600'
                        }
                    `}
                >
                    {score}
                </button>
            ))}
        </div>
      </div>
      
       {/* Background Decoration */}
       <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-saachi-secondary/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MoodTracker;