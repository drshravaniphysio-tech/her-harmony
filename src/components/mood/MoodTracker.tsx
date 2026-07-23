import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Zap, 
  Brain, 
  Heart, 
  Plus, 
  Save, 
  Loader2, 
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { MoodLog } from '../../types';

const moodOptions = [
  { label: 'Happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50', value: 'happy', emoji: '😊' },
  { label: 'Peaceful', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', value: 'peaceful', emoji: '😌' },
  { label: 'Okay', icon: Meh, color: 'text-slate-500', bg: 'bg-slate-50', value: 'okay', emoji: '😐' },
  { label: 'Stressed', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', value: 'stressed', emoji: '😫' },
  { label: 'Anxious', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50', value: 'anxious', emoji: '😰' },
  { label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50', value: 'sad', emoji: '😢' },
];

export default function MoodTracker({ user }: { user: User }) {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [happinessLevel, setHappinessLevel] = useState(5);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const q = query(
        collection(db, 'moodLogs'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodLog)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    try {
      const moodInfo = moodOptions.find(m => m.value === selectedMood);
      await addDoc(collection(db, 'moodLogs'), {
        userId: user.uid,
        mood: selectedMood,
        emojis: [moodInfo?.emoji || ''],
        journalEntry,
        stressLevel,
        happinessLevel,
        timestamp: serverTimestamp(),
      });
      setSelectedMood(null);
      setJournalEntry('');
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Mood Tracker</h1>
        <p className="text-slate-500">How's your heart feeling today?</p>
      </header>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700">Select your mood</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                  selectedMood === mood.value 
                    ? "border-lavender-500 bg-lavender-50 ring-2 ring-lavender-100" 
                    : "border-transparent " + mood.bg
                )}
              >
                <mood.icon className={cn("w-8 h-8", mood.color)} />
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", mood.color)}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700">Stress Level</h2>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-lavender-500" 
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Calm</span>
              <span>Intense</span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700">Happiness Level</h2>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={happinessLevel}
              onChange={(e) => setHappinessLevel(parseInt(e.target.value))}
              className="w-full accent-pink-500" 
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Low</span>
              <span>Radiant</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700">Journal Entry</h2>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 min-h-[150px] outline-none focus:ring-2 focus:ring-lavender-500 transition-all text-slate-700"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !selectedMood}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-100"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Log Daily Mood
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <History className="w-6 h-6 text-slate-400" />
          Recent Reflections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {logs.map((log) => {
              const moodInfo = moodOptions.find(m => m.value === log.mood);
              return (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-4"
                >
                  <div className={cn("p-4 rounded-2xl shrink-0 h-fit", moodInfo?.bg)}>
                    <span className="text-2xl">{log.emojis?.[0]}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 capitalize">{log.mood}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {log.timestamp?.seconds ? format(new Date(log.timestamp.seconds * 1000), 'MMM d, h:mm a') : 'Just now'}
                      </span>
                    </div>
                    {log.journalEntry && (
                      <p className="text-sm text-slate-500 line-clamp-2 italic">"{log.journalEntry}"</p>
                    )}
                    <div className="flex gap-4 pt-1">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] font-bold text-slate-400">Stress: {log.stressLevel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-400" />
                        <span className="text-[10px] font-bold text-slate-400">Joy: {log.happinessLevel}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
