import { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Users, 
  Home, 
  Briefcase, 
  Shield, 
  Sparkles, 
  Loader2,
  Send,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

const focusAreas = [
  { id: 'dating', label: 'Dating', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'marriage', label: 'Marriage', icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'family', label: 'Family', icon: Users, color: 'text-sage-600', bg: 'bg-sage-50' },
  { id: 'work', label: 'Workplace', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'boundaries', label: 'Boundaries', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function RelationshipCoach({ user }: { user: User }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState('dating');

  const getAdvice = async () => {
    if (!query.trim() && !selectedArea) return;
    setLoading(true);
    setAdvice(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Topic: ${selectedArea}. Issue: ${query || 'General advice'}. As a Relationship AI Coach, provide practical suggestions, conversation tips, and emotional intelligence guidance. Encourage respectful, healthy communication and setting boundaries.`,
          systemInstruction: "You are a specialist Relationship AI Coach within HerHarmony AI. You help women with dating, marriage, family conflicts, and workplace relationships. You focus on communication, conflict resolution, and trust building. Always encourage healthy boundaries."
        }),
      });
      const data = await res.json();
      setAdvice(data.text);
    } catch (err) {
      console.error(err);
      setAdvice("I'm sorry, I couldn't get coaching advice right now. Please try again soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Relationship AI Coach</h1>
        <p className="text-slate-500">Navigate your connections with wisdom and grace.</p>
      </header>

      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-lavender-500" />
            What's on your heart?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {focusAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                  selectedArea === area.id 
                    ? "border-lavender-500 bg-lavender-50" 
                    : "border-transparent " + area.bg
                )}
              >
                <area.icon className={cn("w-6 h-6", area.color)} />
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", area.color)}>{area.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the situation or ask for specific advice..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 min-h-[120px] outline-none focus:ring-2 focus:ring-lavender-500 transition-all text-slate-700 shadow-inner"
          />
          <button
            onClick={getAdvice}
            disabled={loading}
            className="absolute right-4 bottom-4 bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {advice && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] border border-pink-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-pink-400" />
            <div className="flex items-center gap-2 mb-6 text-pink-600 font-bold">
              <Sparkles className="w-5 h-5" />
              Coach's Guidance
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Boundary Tip
          </h3>
          <p className="text-sm text-indigo-800 opacity-80 italic">
            "Boundaries are not walls; they are the gates that allow you to let in what nourishes you and keep out what drains you."
          </p>
        </div>
        <div className="p-6 bg-sage-50 rounded-3xl border border-sage-100">
          <h3 className="font-bold text-sage-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Communication Tool
          </h3>
          <p className="text-sm text-sage-800 opacity-80 italic">
            Try using 'I' statements: "I feel [emotion] when [action] because [need]." It reduces defensiveness in others.
          </p>
        </div>
      </div>
    </div>
  );
}
