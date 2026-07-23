import { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Search, 
  Apple, 
  Beef, 
  Leaf, 
  Coffee, 
  Clock, 
  TrendingDown,
  Info,
  Loader2,
  Sparkles,
  ChevronRight,
  Droplets
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

const quickTopics = [
  'Weight loss', 'PCOS diet', 'Pregnancy nutrition', 'Menopause nutrition', 
  'Iron deficiency', 'Diabetes-friendly', 'Thyroid-friendly', 'High-protein vegetarian'
];

export default function Nutrition({ user }: { user: User }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSearch = async (q?: string) => {
    const searchTerm = q || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          userData: {
            // In a real app, fetch these from Firestore
            age: 28,
            goal: 'wellness'
          }
        }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (err) {
      console.error(err);
      setResponse("I'm sorry, I couldn't generate a nutrition plan right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Nutrition AI</h1>
        <p className="text-slate-500">Personalized fuel for your unique body.</p>
      </header>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask anything about nutrition... (e.g., 'What should I eat for PCOS?')"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 pr-16 outline-none focus:ring-2 focus:ring-sage-500 transition-all shadow-inner"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-sage-600 text-white p-2.5 rounded-xl hover:bg-sage-700 transition-colors shadow-lg shadow-sage-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickTopics.map(topic => (
            <button
              key={topic}
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold hover:bg-sage-50 hover:text-sage-600 transition-all border border-slate-100"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {response && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] border border-sage-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="p-2 bg-sage-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-sage-500" />
              </div>
            </div>
            
            <div className="markdown-body prose prose-slate max-w-none prose-p:leading-relaxed prose-li:my-1">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Did you know?</h3>
            <p className="text-sm text-amber-800 opacity-80 leading-relaxed">
              Consuming iron-rich foods with Vitamin C (like spinach with lemon) significantly improves absorption, which is especially important for women's health.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shrink-0">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Hydration Reminder</h3>
            <p className="text-sm text-blue-800 opacity-80 leading-relaxed">
              Staying hydrated helps manage hormonal fluctuations and improves focus. Try to drink at least 2.5L today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
