import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  LayoutDashboard, 
  MessageCircle, 
  Calendar, 
  Utensils, 
  Activity, 
  MapPin, 
  Settings,
  LogIn,
  LogOut,
  User as UserIcon,
  Users,
  Wind
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import Companion from './components/chat/Companion';
import MoodTracker from './components/mood/MoodTracker';
import HealthTracker from './components/health/HealthTracker';
import Planner from './components/planner/Planner';
import Nutrition from './components/nutrition/Nutrition';
import Healing from './components/healing/Healing';
import RelationshipCoach from './components/relationship/RelationshipCoach';
import BreathingExercise from './components/breathing/BreathingExercise';
import Auth from './components/auth/Auth';

const Navbar = ({ user }: { user: User | null }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/companion', icon: MessageCircle, label: 'Companion' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/health', icon: Activity, label: 'Health' },
    { path: '/planner', icon: Calendar, label: 'Planner' },
    { path: '/nutrition', icon: Utensils, label: 'Nutrition' },
    { path: '/healing', icon: MapPin, label: 'Healing' },
    { path: '/breathing', icon: Wind, label: 'Breathe' },
    { path: '/relationship', icon: Users, label: 'Relationships' },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-lavender-100 z-50 px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:border-lavender-100 overflow-x-auto no-scrollbar">
      <div className="max-w-screen-xl mx-auto flex justify-around md:justify-between items-center gap-4">
        <div className="hidden md:flex items-center gap-2 font-display font-bold text-lavender-600 shrink-0">
          <Heart className="w-6 h-6 fill-lavender-400 text-lavender-400" />
          <span className="text-xl tracking-tight">HerHarmony</span>
        </div>
        
        <div className="flex gap-1 md:gap-4 flex-1 justify-center max-w-fit md:max-w-none overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px]",
                  isActive 
                    ? "text-lavender-600 bg-lavender-50 shadow-sm shadow-lavender-100/50" 
                    : "text-slate-400 hover:text-lavender-500 hover:bg-lavender-50/30"
                )}
              >
                <item.icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] mt-1 font-medium md:text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button 
            onClick={() => auth.signOut()}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FFF9FB]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Heart className="w-12 h-12 text-pink-400 fill-pink-200" />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-harmony-bg text-slate-800 pb-20 md:pb-0 md:pt-20">
        <Navbar user={user} />
        
        <main className="max-w-screen-xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes>
              {!user ? (
                <Route path="*" element={<Auth />} />
              ) : (
                <>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/companion" element={<Companion user={user} />} />
                  <Route path="/mood" element={<MoodTracker user={user} />} />
                  <Route path="/health" element={<HealthTracker user={user} />} />
                  <Route path="/planner" element={<Planner user={user} />} />
                  <Route path="/nutrition" element={<Nutrition user={user} />} />
                  <Route path="/healing" element={<Healing user={user} />} />
                  <Route path="/breathing" element={<BreathingExercise />} />
                  <Route path="/relationship" element={<RelationshipCoach user={user} />} />
                </>
              )}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
