import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, PenTool, Lock, Save, Loader2, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://study-finder-ai.onrender.com';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        subjects: '',
        currentPassword: '',
        newPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [subjectInput, setSubjectInput] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);

    // Fetch current profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = res.data;
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    bio: user.bio || '',
                }));
                setSubjectsList(user.subjects || []);
            } catch (err) {
                setError("Failed to load profile.");
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add subject on Enter or comma
    const handleSubjectKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = subjectInput.trim().replace(',', '');
            if (val && !subjectsList.includes(val)) {
                setSubjectsList([...subjectsList, val]);
            }
            setSubjectInput('');
        }
    };

    const removeSubject = (subject) => {
        setSubjectsList(subjectsList.filter(s => s !== subject));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: formData.name,
                bio: formData.bio,
                subjects: subjectsList,
            };

            // Only send password fields if user filled them
            if (formData.currentPassword && formData.newPassword) {
                payload.currentPassword = formData.currentPassword;
                payload.newPassword = formData.newPassword;
            }

            const res = await axios.put(`${BASE_URL}/api/users/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update localStorage with new data
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('token', res.data.token);

            setSuccess("Profile updated successfully!");
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));

            // Clear success after 3 seconds
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
                        <p className="text-slate-500 mt-1 text-sm">Update your personal info and preferences.</p>
                    </header>

                    {/* Avatar Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6 flex items-center gap-5">
                        <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20 flex-shrink-0">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg">{formData.name || user.name}</h2>
                            <p className="text-slate-500 text-sm">{user.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
                                {user.role || 'student'}
                            </span>
                        </div>
                    </div>

                    {/* Success / Error */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> {success}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSave} className="space-y-5">

                        {/* Basic Info Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Basic Info</h3>

                            {/* Name */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                                <User className="absolute left-3.5 top-[38px] text-slate-400" size={15} />
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            {/* Email — Read only */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email <span className="text-slate-400 font-normal">(cannot be changed)</span></label>
                                <Mail className="absolute left-3.5 top-[38px] text-slate-300" size={15} />
                                <input
                                    value={user.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Bio */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
                                <PenTool className="absolute left-3.5 top-[38px] text-slate-400" size={15} />
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none transition-all"
                                    placeholder="Tell peers about your study goals..."
                                />
                            </div>
                        </div>

                        {/* Subjects Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Subjects</h3>

                            {/* Subject Tags */}
                            <div className="flex flex-wrap gap-2 min-h-[36px]">
                                {subjectsList.map((sub, i) => (
                                    <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                        {sub}
                                        <button type="button" onClick={() => removeSubject(sub)} className="text-blue-400 hover:text-red-500 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                {subjectsList.length === 0 && (
                                    <p className="text-xs text-slate-400 italic">No subjects added yet.</p>
                                )}
                            </div>

                            {/* Subject Input */}
                            <div className="relative">
                                <BookOpen className="absolute left-3.5 top-[13px] text-slate-400" size={15} />
                                <input
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    onKeyDown={handleSubjectKeyDown}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                    placeholder="Type a subject and press Enter to add..."
                                />
                            </div>
                            <p className="text-xs text-slate-400">Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">Enter</kbd> or <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">,</kbd> to add a subject. Click <X size={10} className="inline" /> to remove.</p>
                        </div>

                        {/* Password Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Change Password <span className="text-slate-400 font-normal normal-case">(optional)</span></h3>

                            {/* Current Password */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
                                <Lock className="absolute left-3.5 top-[38px] text-slate-400" size={15} />
                                <input
                                    name="currentPassword"
                                    type={showCurrentPass ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                    placeholder="Enter current password"
                                />
                                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
                                <Lock className="absolute left-3.5 top-[38px] text-slate-400" size={15} />
                                <input
                                    name="newPassword"
                                    type={showNewPass ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                    placeholder="Min 6 characters"
                                />
                                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;