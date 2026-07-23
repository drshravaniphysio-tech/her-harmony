import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Calendar,
  Sparkles,
  BookOpen,
  Coffee,
  Heart,
  Droplets,
  Zap,
  Moon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { PlannerTask } from '../../types';

const taskTypes = [
  { label: 'Meditation', icon: Wind, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Stretching', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Reading', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Walking', icon: MapPin, color: 'text-sage-500', bg: 'bg-sage-50' },
  { label: 'Gratitude', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { label: 'Hydration', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Skin Care', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Relaxation', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
];

// Fallback icons if some are missing from imports
import { Wind, Activity, MapPin } from 'lucide-react';

export default function Planner({ user }: { user: User }) {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedType, setSelectedType] = useState<PlannerTask['type']>('Meditation');

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const q = query(
        collection(db, 'plannerTasks'),
        where('userId', '==', user.uid),
        where('date', '==', today)
      );
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlannerTask)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'plannerTasks'), {
        userId: user.uid,
        title: newTaskTitle,
        type: selectedType,
        completed: false,
        date: today,
        createdAt: serverTimestamp(),
      });
      setTasks([...tasks, { id: docRef.id, userId: user.uid, title: newTaskTitle, type: selectedType, completed: false, date: today }]);
      setNewTaskTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task: PlannerTask) => {
    if (!task.id) return;
    try {
      await updateDoc(doc(db, 'plannerTasks', task.id), {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'plannerTasks', taskId));
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Self-Care Planner</h1>
          <p className="text-slate-500">Your daily rituals for a balanced soul.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-lavender-500 uppercase tracking-widest">{format(new Date(), 'EEEE')}</p>
          <p className="text-xl font-bold text-slate-800">{format(new Date(), 'MMM d')}</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-wrap gap-2">
          {taskTypes.map(type => (
            <button
              key={type.label}
              onClick={() => setSelectedType(type.label as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedType === type.label 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new ritual..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-lavender-500 transition-all"
          />
          <button
            onClick={addTask}
            className="bg-lavender-600 text-white p-4 rounded-2xl hover:bg-lavender-700 transition-all shadow-lg shadow-lavender-100"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => {
            const typeInfo = taskTypes.find(t => t.label === task.type) || taskTypes[0];
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-3xl border transition-all",
                  task.completed 
                    ? "bg-slate-50 border-slate-100 opacity-60" 
                    : "bg-white border-slate-100 shadow-sm hover:border-lavender-200"
                )}
              >
                <button 
                  onClick={() => toggleTask(task)}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    task.completed ? "text-emerald-500" : "text-slate-300 hover:text-lavender-400"
                  )}
                >
                  {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                </button>

                <div className={cn("p-2 rounded-xl", typeInfo.bg)}>
                  <typeInfo.icon className={cn("w-5 h-5", typeInfo.color)} />
                </div>

                <div className="flex-1">
                  <h3 className={cn(
                    "font-bold text-slate-800",
                    task.completed && "line-through text-slate-400"
                  )}>
                    {task.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.type}</span>
                </div>

                <button
                  onClick={() => deleteTask(task.id!)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">No rituals planned for today yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
