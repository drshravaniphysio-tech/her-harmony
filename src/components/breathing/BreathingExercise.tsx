import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, Pause, RotateCcw, ChevronLeft, Info, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

type BreathingPattern = {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
};

const patterns: BreathingPattern[] = [
  { 
    name: 'Box Breathing', 
    inhale: 4, hold1: 4, exhale: 4, hold2: 4,
    description: 'Used by navy seals to stay calm and focused under pressure.'
  },
  { 
    name: '4-7-8 Relax', 
    inhale: 4, hold1: 7, exhale: 8, hold2: 0,
    description: 'A natural tranquilizer for the nervous system, great for sleep.'
  },
  { 
    name: 'Equal Breath', 
    inhale: 4, hold1: 0, exhale: 4, hold2: 0,
    description: 'Simple balance for your mind and body.'
  }
];

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Transition logic based on current phase
            switch(phase) {
              case 'rest':
                setPhase('inhale');
                return selectedPattern.inhale;
              case 'inhale':
                if (selectedPattern.hold1 > 0) {
                  setPhase('hold');
                  return selectedPattern.hold1;
                }
                setPhase('exhale');
                return selectedPattern.exhale;
              case 'hold':
                setPhase('exhale');
                return selectedPattern.exhale;
              case 'exhale':
                if (selectedPattern.hold2 > 0) {
                  setPhase('rest'); // using rest for second hold
                  return selectedPattern.hold2;
                }
                setCycles(c => c + 1);
                setPhase('inhale');
                return selectedPattern.inhale;
              default:
                setPhase('inhale');
                return selectedPattern.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhase('rest');
      setTimer(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, selectedPattern]);

  // Initial start
  useEffect(() => {
    if (isActive && phase === 'rest' && timer === 0) {
      setPhase('inhale');
      setTimer(selectedPattern.inhale);
    }
  }, [isActive]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setCycles(0);
    }
  };

  const getPhaseText = () => {
    switch(phase) {
      case 'inhale': return 'Inhale Deeply';
      case 'hold': return 'Hold Peace';
      case 'exhale': return 'Exhale Stress';
      case 'rest': return isActive ? 'Hold' : 'Ready?';
      default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Breathing Sanctuary</h1>
          <p className="text-sm text-slate-500">Immediate relief for your nervous system.</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-12 relative overflow-hidden">
        {/* Animated Background Pulse */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: phase === 'inhale' ? 1.5 : (phase === 'exhale' ? 0.8 : 1.2),
                opacity: phase === 'inhale' ? 0.2 : (phase === 'exhale' ? 0.1 : 0.15)
              }}
              transition={{ duration: timer, ease: "linear" }}
              className="absolute inset-0 bg-lavender-500 rounded-full blur-[120px] pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 space-y-2">
          <h2 className="text-4xl font-display font-bold text-slate-800 h-12">{getPhaseText()}</h2>
          <p className="text-lavender-600 font-display font-bold text-7xl tracking-tighter tabular-nums">
            {timer > 0 ? timer : ''}
          </p>
        </div>

        {/* The Visual Guide Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: isActive ? (phase === 'inhale' ? [1, 2] : (phase === 'exhale' ? [2, 1] : (phase === 'hold' ? 2 : 1))) : 1,
              backgroundColor: phase === 'inhale' ? '#D8B4FE' : (phase === 'exhale' ? '#FDA4AF' : '#F3E8FF')
            }}
            transition={{ 
              duration: isActive ? (phase === 'inhale' ? selectedPattern.inhale : (phase === 'exhale' ? selectedPattern.exhale : 0.5)) : 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-32 h-32 rounded-full shadow-[0_0_50px_rgba(167,139,250,0.3)]"
          />
          <div className="relative z-10 text-slate-800 font-bold">
            {cycles > 0 && <div className="text-xs uppercase tracking-widest text-slate-400">Cycle {cycles}</div>}
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <button
            onClick={toggleExercise}
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl",
              isActive 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-lavender-600 text-white hover:bg-lavender-700 shadow-lavender-100"
            )}
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            {isActive ? 'Pause' : 'Start Session'}
          </button>
          
          <button
            onClick={() => { setIsActive(false); setCycles(0); setTimer(0); setPhase('rest'); }}
            className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patterns.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setSelectedPattern(p);
              setIsActive(false);
            }}
            className={cn(
              "p-6 rounded-3xl border transition-all text-left space-y-2",
              selectedPattern.name === p.name 
                ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                : "bg-white border-slate-100 text-slate-500 hover:border-lavender-200"
            )}
          >
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-[10px] leading-relaxed opacity-70">{p.description}</p>
            <div className="flex gap-1 pt-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10">{p.inhale}s</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10">{p.hold1}s</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10">{p.exhale}s</span>
            </div>
          </button>
        ))}
      </section>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
        <div className="p-3 bg-white rounded-2xl">
          <Info className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 mb-1">Safety First</h3>
          <p className="text-sm text-amber-800/80 leading-relaxed">
            If you feel dizzy or lightheaded, please stop immediately and return to your natural breathing pattern. It's perfectly okay to take it slow.
          </p>
        </div>
      </div>
    </div>
  );
}
