import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Plus, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Brain,
  Zap,
  Star,
  Activity,
  Sparkles,
  Wind
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { MoodLog } from '../../types';

import { Link } from 'react-router-dom';
import GratitudeInput from './GratitudeInput';

const moods = [
  { label: 'Happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50', value: 'happy' },
  { label: 'Peaceful', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', value: 'peaceful' },
  { label: 'Okay', icon: Meh, color: 'text-slate-500', bg: 'bg-slate-50', value: 'okay' },
  { label: 'Stressed', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', value: 'stressed' },
  { label: 'Anxious', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50', value: 'anxious' },
  { label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50', value: 'sad' },
];

export default function Dashboard({ user }: { user: User }) {
  const [recentMoods, setRecentMoods] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [affirmation, setAffirmation] = useState('');

  const affirmations = [
    "I am worthy of peace, love, and healing.",
    "My feelings are valid, and I am listening to my body.",
    "I choose to be kind to myself today.",
    "I am blooming at my own pace.",
    "I have the strength to navigate any challenge.",
    "I am surrounded by abundance and support."
  ];

  useEffect(() => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    const fetchMoods = async () => {
      try {
        const q = query(
          collection(db, 'moodLogs'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        setRecentMoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodLog)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, [user]);

  const logMood = async (mood: string) => {
    try {
      await addDoc(collection(db, 'moodLogs'), {
        userId: user.uid,
        mood,
        timestamp: serverTimestamp(),
      });
      // Optionally refresh moods or show a success toast
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Wellness Index', value: '88', icon: Activity, color: 'text-sage-600', bg: 'bg-sage-50' },
    { label: 'Mindful Streak', value: '14 Days', icon: Star, color: 'text-lavender-600', bg: 'bg-lavender-50' },
    { label: 'Mood Balance', value: 'Stable', icon: Smile, color: 'text-blush-600', bg: 'bg-blush-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome back, {user.displayName?.split(' ')[0]} 🌸
          </h1>
          <p className="text-slate-500 italic mt-1">"{affirmation}"</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{format(new Date(), 'EEEE')}</p>
          <p className="text-lg font-bold text-slate-800">{format(new Date(), 'MMMM do, yyyy')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Smile className="w-6 h-6 text-amber-500" />
              How are you feeling?
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => logMood(mood.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-6 rounded-3xl transition-all border shadow-sm group",
                  mood.bg,
                  "border-transparent hover:border-current hover:shadow-md active:scale-95"
                )}
              >
                <mood.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", mood.color)} />
                <span className={cn("text-xs font-bold uppercase tracking-wider", mood.color)}>{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Need a little peace?</h2>
            <p className="text-slate-400 mb-6 max-w-xs">Talk to your wellness companion about whatever is on your mind.</p>
            <Link 
              to="/companion"
              className="inline-flex items-center gap-2 bg-lavender-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-lavender-600 transition-all shadow-lg shadow-lavender-500/20"
            >
              Start Chatting
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-lavender-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
        </section>

        <section className="bg-lavender-50 p-8 rounded-[2.5rem] border border-lavender-100 relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <div className="bg-white p-3 rounded-2xl w-fit mb-4 shadow-sm shadow-lavender-100">
              <Wind className="w-6 h-6 text-lavender-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Quick Relief</h2>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">Feeling overwhelmed? Take a 1-minute guided breathing break to center your soul.</p>
            <Link 
              to="/breathing"
              className="inline-flex items-center gap-2 bg-white text-lavender-700 px-6 py-3 rounded-2xl font-bold hover:gap-4 transition-all shadow-sm hover:shadow-md"
            >
              Breathe Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute -bottom-12 -right-12 w-64 h-64 bg-lavender-200/40 rounded-full blur-3xl"
          />
        </section>

        <GratitudeInput user={user} />
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          Your Healing Progress
        </h2>
        <div className="space-y-4">
          {['Mindfulness', 'Hydration', 'Rest', 'Nutrition'].map((task, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-lavender-50 group-hover:border-lavender-100 transition-all">
                <Calendar className="w-5 h-5 text-slate-400 group-hover:text-lavender-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700">{task}</span>
                  <span className="text-xs text-slate-400 font-medium">{75 + i * 5}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${75 + i * 5}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full bg-lavender-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
