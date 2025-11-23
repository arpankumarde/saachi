import React from 'react';
import { Task } from '../types';
import { CheckSquare, Calendar, Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface TaskPanelProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onToggleTask }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-saachi-secondary p-5 h-full flex flex-col">
      <h3 className="font-serif font-medium text-saachi-text mb-6 flex items-center justify-between text-lg">
        <span className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-saachi-accent" />
            Insights & Tasks
        </span>
        <span className="text-xs font-sans bg-saachi-primary/10 text-saachi-primary px-2 py-1 rounded-full font-bold">{tasks.filter(t => t.status === 'pending').length}</span>
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 text-xs text-center py-8">
            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
            <p>No active tasks identified yet.</p>
            <p className="mt-1 opacity-70">Chat with Saachi to automatically uncover action items.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
                key={task.id} 
                className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${task.status === 'completed' ? 'bg-stone-50/50 border-stone-100 opacity-60' : 'bg-white border-stone-100 shadow-sm hover:border-saachi-accent/30 hover:shadow-md'}`}
            >
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-stone-300 hover:text-saachi-primary'}`}
              >
                {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${task.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}`}>
                    {task.title}
                </p>
                
                <div className="flex items-center gap-2 mt-1.5">
                    {task.dueDate && (
                        <p className="text-[10px] text-amber-600 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                        </p>
                    )}
                    {task.origin === 'chat' && (
                        <span className="text-[9px] uppercase tracking-wide text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-2 h-2" /> AI Extracted
                        </span>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskPanel;