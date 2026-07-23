import { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Sparkles, 
  Palette, 
  Heart, 
  Wind, 
  Waves, 
  Mountain, 
  TreePine,
  Coffee,
  Loader2,
  ChevronRight,
  Info,
  DollarSign,
  Sun
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

export default function Healing({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<'places' | 'plans' | 'colors'>('places');
  const [loading, setLoading] = useState(false);
  const [placesResponse, setPlacesResponse] = useState<string | null>(null);
  
  // Color analysis state
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [colorAnalysis, setColorAnalysis] = useState<string | null>(null);

  const handlePlacesSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/healing-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: 'nature, quiet, mountains',
          budget: 'Middle',
          location: 'Auto-detect'
        }),
      });
      const data = await res.json();
      setPlacesResponse(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeColors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my favorite colors: ${favoriteColors.join(', ')}. Tell me which colors improve my mood, reduce anxiety, help with sleep, and boost focus based on color psychology. Provide a friendly analysis for a woman's wellness companion.`,
        }),
      });
      const data = await res.json();
      setColorAnalysis(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: 'Lavender', hex: '#E6E6FA', class: 'bg-[#E6E6FA]' },
    { name: 'Sage', hex: '#B2AC88', class: 'bg-[#B2AC88]' },
    { name: 'Blush', hex: '#FFD1DC', class: 'bg-[#FFD1DC]' },
    { name: 'Sky', hex: '#87CEEB', class: 'bg-[#87CEEB]' },
    { name: 'Amber', hex: '#FFBF00', class: 'bg-[#FFBF00]' },
    { name: 'Mint', hex: '#98FF98', class: 'bg-[#98FF98]' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Healing & Recovery</h1>
        <p className="text-slate-500">Finding peace in places, plans, and colors.</p>
      </header>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
        {[
          { id: 'places', label: 'Places', icon: MapPin },
          { id: 'plans', label: 'Plans', icon: Sparkles },
          { id: 'colors', label: 'Colors', icon: Palette },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-slate-900 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'places' && (
          <motion.div
            key="places"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Healing Place Recommendations</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Beach', icon: Waves, color: 'text-blue-500' },
                  { label: 'Mountains', icon: Mountain, color: 'text-emerald-600' },
                  { label: 'Forest', icon: TreePine, color: 'text-sage-700' },
                  { label: 'Cafés', icon: Coffee, color: 'text-amber-700' },
                ].map(pref => (
                  <button key={pref.label} className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-all border border-slate-100">
                    <pref.icon className={cn("w-6 h-6", pref.color)} />
                    <span className="text-xs font-bold text-slate-600 uppercase">{pref.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handlePlacesSearch}
                disabled={loading}
                className="w-full bg-lavender-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-lavender-700 transition-all shadow-xl shadow-lavender-100"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Find My Healing Space
              </button>
            </section>

            {placesResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2rem] border border-lavender-100 shadow-sm"
              >
                <div className="markdown-body prose prose-slate max-w-none">
                  <ReactMarkdown>{placesResponse}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'colors' && (
          <motion.div
            key="colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Color Psychology Analysis</h2>
                <p className="text-slate-500 text-sm">Select colors you are naturally drawn to today.</p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setFavoriteColors(prev => 
                        prev.includes(color.name) ? prev.filter(c => c !== color.name) : [...prev, color.name]
                      );
                    }}
                    className={cn(
                      "group flex flex-col items-center gap-2 transition-all",
                      favoriteColors.includes(color.name) ? "scale-110" : "scale-100"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full border-4 transition-all",
                      color.class,
                      favoriteColors.includes(color.name) ? "border-slate-800 shadow-lg" : "border-white"
                    )} />
                    <span className="text-[10px] font-bold text-slate-500">{color.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={analyzeColors}
                disabled={loading || favoriteColors.length === 0}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
                Analyze My Color Palette
              </button>
            </section>

            {colorAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2rem] border border-indigo-100 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold">
                  <Sparkles className="w-5 h-5" />
                  Your Personalized Color Insights
                </div>
                <div className="markdown-body prose prose-slate max-w-none prose-p:text-slate-600">
                  <ReactMarkdown>{colorAnalysis}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2">Personalized Healing Plans</h2>
                <p className="text-slate-400 mb-6 text-sm">Recover from stress, burnout, or emotional transitions.</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Stress', 'Burnout', 'Heartbreak', 'Grief', 'Pregnancy', 'Postpartum'].map(issue => (
                    <button key={issue} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
                      {issue}
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  Generate My Plan
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
