import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { GratitudeLog } from '../../types';

export default function GratitudeInput({ user }: { user: User }) {
  const [items, setItems] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingLog, setExistingLog] = useState<GratitudeLog | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchTodayGratitude = async () => {
      try {
        const q = query(
          collection(db, 'gratitudeLogs'),
          where('userId', '==', user.uid),
          where('date', '==', today),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as GratitudeLog;
          setExistingLog(data);
          setItems(data.items);
          setSaved(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodayGratitude();
  }, [user, today]);

  const handleSave = async () => {
    if (items.some(item => !item.trim())) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'gratitudeLogs'), {
        userId: user.uid,
        items: items.map(i => i.trim()),
        date: today,
        timestamp: serverTimestamp(),
      });
      setSaved(true);
      setExistingLog({ userId: user.uid, items, date: today, timestamp: new Date() });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <section className="bg-white p-8 rounded-[2rem] border border-pink-100 shadow-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <Heart className="w-24 h-24 text-pink-400 fill-pink-200" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-200" />
          <h2 className="text-xl font-bold text-slate-800">Daily Gratitude</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6">What are 3 things you're thankful for today?</p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                disabled={saved}
                placeholder="Today, I am grateful for..."
                className={cn(
                  "flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none transition-all",
                  saved ? "bg-white border-transparent text-slate-500 font-medium italic" : "focus:ring-2 focus:ring-pink-200 focus:bg-white"
                )}
              />
            </div>
          ))}
        </div>

        {!saved ? (
          <button
            onClick={handleSave}
            disabled={loading || items.some(item => !item.trim())}
            className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Save My Gratitude
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            Gratitude logged. You're doing great!
          </motion.div>
        )}
      </div>
    </section>
  );
}
