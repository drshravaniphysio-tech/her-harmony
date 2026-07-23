import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-lavender-100/50 border border-lavender-50"
      >
        <div className="mb-8 relative inline-block">
          <div className="bg-lavender-50 p-6 rounded-3xl">
            <Heart className="w-16 h-16 text-lavender-500 fill-lavender-200" />
          </div>
          <Sparkles className="absolute -top-3 -right-3 text-amber-400 w-8 h-8 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">HerHarmony</h1>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Your personal space for growth, healing, and mindfulness. 
          Step into a journey crafted just for you.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-slate-200"
        >
          <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
          {loading ? 'Entering...' : 'Enter with Google'}
        </button>

        {error && (
          <p className="mt-6 text-rose-500 text-sm bg-rose-50 p-3 rounded-xl border border-rose-100">
            {error}
          </p>
        )}

        <div className="mt-10 pt-10 border-t border-slate-50 flex justify-around text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lavender-400 shadow-sm shadow-lavender-200" />
            Secure
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sage-400 shadow-sm shadow-sage-200" />
            Private
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blush-400 shadow-sm shadow-blush-200" />
            Empowering
          </div>
        </div>
      </motion.div>
    </div>
  );
}
