import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, ArrowRight, BookOpen, Cpu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ unreadCount }) => {
  const navigate = useNavigate();
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FIX 1: Safely handle null user object
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchRecentConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRecentChats(res.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard chats fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentConversations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar unreadCount={unreadCount} />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user.name || 'Laiba'} !
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Ready to excel in your study modules today?
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
              {user.name ? user.name.charAt(0).toUpperCase() : 'L'}
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Academic Stack */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Verified Academic Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {/* FIX 2: Dynamic Subjects display instead of hardcoded React */}
                  {user.subjects && user.subjects.length > 0 ? (
                    user.subjects.map((sub, index) => (
                      <span key={index} className="text-xs uppercase font-extrabold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md tracking-wider">
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs uppercase font-extrabold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md tracking-wider">
                      General
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Active routing constraints</p>
            </div>

            {/* Card 2: Recent Direct Peer Chats */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-10 w-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-3">Recent Direct Peer Chats</h3>
                
                <div className="space-y-2">
                  {loading ? (
                    <p className="text-xs text-slate-400 italic">Loading chats...</p>
                  ) : recentChats.length > 0 ? (
                    recentChats.map((peer) => (
                      <div 
                        key={peer._id}
                        onClick={() => navigate(`/messages/${peer._id}`)}
                        className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-100"
                      >
                        <div className="h-6 w-6 bg-blue-100 text-blue-600 font-bold rounded-full text-[10px] flex items-center justify-center">
                          {peer.name ? peer.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">{peer.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No concurrent chat nodes open.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => navigate('/messages')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all mt-4 w-fit"
              >
                Open Chat Workspace <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 3: AI Coprocessor */}
            <div className="bg-slate-950 p-6 rounded-3xl shadow-xl flex flex-col justify-between text-white min-h-[220px]">
              <div>
                <div className="h-10 w-10 bg-white/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <Cpu size={20} />
                </div>
                <h3 className="font-bold text-lg mb-1">AI Coprocessor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Isolate systemic friction points. Query custom LLM expert models instantly.
                </p>
              </div>
              <button 
                onClick={() => navigate('/aitutor')}
                className="w-full bg-white text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition-all mt-4"
              >
                Initialize Instance
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;