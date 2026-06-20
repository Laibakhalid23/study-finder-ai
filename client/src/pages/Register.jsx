import React, { useState } from 'react';
import { User, Mail, Lock, BookOpen, PenTool, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', subjects: '', bio: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formattedData = {
                ...formData,
                subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
            };

            const baseUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:5000'
                : 'https://study-finder-ai.onrender.com';

            await axios.post(`${baseUrl}/api/users/register`, formattedData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 md:p-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/10 mb-4">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Create your account</h2>
                    <p className="text-slate-500 text-sm mt-1.5">Join StudyAI to collaborate with peers and smart models.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3.5 top-[13px] text-slate-400" size={16} />
                            <input
                                name="name"
                                placeholder="Full Name"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-[13px] text-slate-400" size={16} />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password with Eye Toggle */}
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-[13px] text-slate-400" size={16} />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Secure Password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Subjects */}
                    <div className="relative">
                        <BookOpen className="absolute left-3.5 top-[13px] text-slate-400" size={16} />
                        <input
                            name="subjects"
                            placeholder="Subjects (comma separated: React, Python, UI Design)"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div className="relative">
                        <PenTool className="absolute left-3.5 top-[13px] text-slate-400" size={16} />
                        <textarea
                            name="bio"
                            placeholder="Briefly tell us about your study goals..."
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm h-24 resize-none transition-all"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Account"}
                    </button>

                    <p className="text-center text-slate-500 text-xs pt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;