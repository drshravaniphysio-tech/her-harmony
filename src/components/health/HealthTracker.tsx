import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Activity, 
  Droplets, 
  Moon, 
  Wind, 
  Scale, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { cn } from '../../lib/utils';
import { HealthLog } from '../../types';

export default function HealthTracker({ user }: { user: User }) {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(8);
  const [exercise, setExercise] = useState(0);
  const [weight, setWeight] = useState(60);
  const [energy, setEnergy] = useState(7);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Mood Swings', 'Breast Tenderness', 'Cravings'];

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const q = query(
        collection(db, 'healthLogs'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthLog)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await addDoc(collection(db, 'healthLogs'), {
        userId: user.uid,
        waterIntake: water,
        sleepHours: sleep,
        exerciseMinutes: exercise,
        weight,
        energyLevel: energy,
        symptoms: selectedSymptoms,
        timestamp: serverTimestamp(),
      });
      setSelectedSymptoms([]);
      setWater(0);
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Health & Cycle</h1>
          <p className="text-slate-500">Track your body's natural rhythms.</p>
        </div>
        <div className="bg-sage-100 px-4 py-2 rounded-2xl text-sage-700 font-bold text-sm flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Day 14 (Ovulation)
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-sage-500" />
            Daily Metrics
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Water Intake</p>
                  <p className="text-xs text-slate-400">{water} ml</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setWater(Math.max(0, water - 250))} className="p-2 hover:bg-slate-50 rounded-lg">-</button>
                <button onClick={() => setWater(water + 250)} className="p-2 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-100">+</button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <Moon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="font-bold text-slate-700">Sleep</p>
                </div>
                <span className="text-sm font-bold text-indigo-600">{sleep} hrs</span>
              </div>
              <input 
                type="range" min="0" max="15" step="0.5" 
                value={sleep} onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-indigo-500" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sage-50 rounded-2xl">
                    <Wind className="w-5 h-5 text-sage-500" />
                  </div>
                  <p className="font-bold text-slate-700">Exercise</p>
                </div>
                <span className="text-sm font-bold text-sage-600">{exercise} min</span>
              </div>
              <input 
                type="range" min="0" max="180" step="5" 
                value={exercise} onChange={(e) => setExercise(parseInt(e.target.value))}
                className="w-full accent-sage-500" 
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedSymptoms.includes(s)
                    ? "bg-sage-500 text-white shadow-lg shadow-sage-100"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-bold text-slate-700">Energy Level</p>
              <span className="text-sm font-bold text-yellow-600">{energy}/10</span>
            </div>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setEnergy(i + 1)}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all",
                    energy > i ? "bg-yellow-400" : "bg-slate-100"
                  )}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-sage-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sage-700 transition-all shadow-xl shadow-sage-50 mt-4"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Daily Health Log
          </button>
        </section>
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-amber-600">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-bold">AI Health Insight</h2>
        </div>
        <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
          <p className="text-slate-700 text-sm leading-relaxed">
            "Your energy levels have been rising over the last 3 days, consistent with your follicular phase. This is a great time for high-intensity workouts or tackling complex projects!"
          </p>
        </div>
      </section>
    </div>
  );
}
