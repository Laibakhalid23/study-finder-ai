import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Users, MessageCircle, ArrowRight, CheckCircle2, Globe, Zap, ArrowUpRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/0 blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/0 blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-slate-200/40 transition-all">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 text-xl font-black text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <span>Study<span className="text-blue-600">AI</span></span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('/login')} className="font-semibold text-sm text-slate-600 hover:text-slate-900 transition">Login</button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-28 text-center relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white border border-slate-200/80 text-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm shadow-slate-100"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Zap size={12} className="text-blue-600 fill-blue-600" /> Introducing StudyAI 2.0
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tight leading-[1.05] max-w-4xl"
          >
            Learn anything <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">with anyone, instantly.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Join a polished network of students. Brainstorm with smart AI, filter peers by exact matching subjects, and level up your grades together.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4">
            <button 
              onClick={() => navigate('/register')} 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all duration-300"
            >
              Start Your Journey 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-base hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm"
            >
              See How it Works
            </button>
          </motion.div>

          {/* Social Stats */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 border border-slate-200/60 bg-white/40 backdrop-blur-md px-8 py-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-slate-600 uppercase tracking-wider"><Globe size={14} className="text-blue-500"/> 190+ Countries</div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block self-center" />
            <div className="flex items-center gap-2 font-semibold text-xs text-slate-600 uppercase tracking-wider"><Users size={14} className="text-indigo-500"/> 50k+ Students</div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block self-center" />
            <div className="flex items-center gap-2 font-semibold text-xs text-slate-600 uppercase tracking-wider"><CheckCircle2 size={14} className="text-emerald-500"/> AI Powered Workspace</div>
          </motion.div>
        </motion.div>
      </header>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 bg-slate-950 text-white rounded-[2.5rem] mx-4 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">succeed.</span></h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base">Powerful full-stack tools designed to make study loops ultra-fast and beautiful.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -6, borderColor: 'rgba(59, 130, 246, 0.4)' }}
              className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-1">Peer Matching <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 text-blue-400 transition-all"/></h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our advanced query sorting instantly bridges you with students learning matching subject modules.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -6, borderColor: 'rgba(147, 51, 234, 0.4)' }}
              className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-1">AI Instant Tutor <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 text-purple-400 transition-all"/></h3>
              <p className="text-slate-400 text-sm leading-relaxed">Stuck on software architecture or complex logic? Access our dedicated AI assistant context window 24/7.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -6, borderColor: 'rgba(16, 185, 129, 0.4)' }}
              className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-1">Socket.io Engine <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-all"/></h3>
              <p className="text-slate-400 text-sm leading-relaxed">Low-latency real-time text threads equipped with intuitive dynamic unread state badges.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/60">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-base font-black text-slate-900">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Sparkles size={14}/></div> StudyAI
          </div>
          <div className="flex gap-6 text-xs font-semibold text-slate-500">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
          </div>
          <p className="text-slate-400 text-xs font-medium">© 2026 StudyAI Node Stack. Professional Grade.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;