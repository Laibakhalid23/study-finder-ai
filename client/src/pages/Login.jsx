import React, { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://https://study-finder-ai.onrender.com/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            alert("Login Successful! 🎉");
            navigate('/dashboard'); 
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden">
         
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-200/60"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 tracking-tight mb-3">
                        <div className="bg-blue-600 p-1 rounded-md text-white"><Sparkles size={12}/></div>
                        StudyAI Platform
                    </div>
                    <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 text-xs mt-1">Access your peer channels and chat workspace.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                            <input 
                                type="email" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                placeholder="name@google.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                            <input 
                                type="password" 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm shadow-md mt-2"
                    >
                        <LogIn size={16} />
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-500 text-xs">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline cursor-pointer">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;