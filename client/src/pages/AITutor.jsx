import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const AITutor = () => {
    const [question, setQuestion] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        const savedUser = JSON.parse(localStorage.getItem('user'));
        const userSubjects = savedUser?.subjects?.join(', ') || "General Studies";

        const userMsg = { role: 'user', text: question };
        setChat((prev) => [...prev, userMsg]);
        setLoading(true);
        const currentQuestion = question;
        setQuestion('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://study-finder-ai.onrender.com/api/ai/ask', 
                { 
                    question: currentQuestion,
                    subject: userSubjects 
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const aiMsg = { role: 'ai', text: res.data.answer };
                setChat((prev) => [...prev, aiMsg]);
            }
        } catch (err) {
            const errorMsg = { role: 'ai', text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again." };
            setChat((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* 1. Sidebar included for consistency */}
            <Sidebar />

            <main className="flex-1 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                    
                    <header className="mb-6">
                        <h2 className="text-3xl font-bold text-slate-800">AI Tutor</h2>
                        <p className="text-slate-500">Get instant help with your complex concepts.</p>
                    </header>

                    {/* Chat Container */}
                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-0">
                        {/* AI Status Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm text-white">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg leading-tight">StudyAI Assistant</h2>
                                    <p className="text-blue-100 text-xs opacity-80 italic">Ready to help with your subjects</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
                            {chat.length === 0 && (
                                <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bot size={32} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-slate-800 font-bold text-lg">Hi there!</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 leading-relaxed">
                                        I can help you with <strong>{JSON.parse(localStorage.getItem('user'))?.subjects?.join(' & ') || 'your studies'}</strong>.
                                    </p>
                                </div>
                            )}

                            {chat.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                                            msg.role === 'user' ? 'bg-blue-600' : 'bg-white border border-slate-200'
                                        }`}>
                                            {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-600" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                        }`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start items-center gap-2 text-blue-600 text-sm font-semibold animate-pulse">
                                    <Bot size={18} /> Tutor is thinking...
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3 shrink-0">
                            <input 
                                type="text" 
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                placeholder="Explain polymorphism like I'm five..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                disabled={loading}
                            />
                            <button 
                                type="submit"
                                disabled={loading || !question.trim()} 
                                className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AITutor;