import React from 'react';
import { User, MessageSquare, Search, LogOut, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ unreadCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Profile', icon: <User size={18} />, path: '/dashboard' },
    { label: 'Find Peers', icon: <Search size={18} />, path: '/findpeers' },
    { label: 'Messages', icon: <MessageSquare size={18} />, path: '/messages' },
    { label: 'AI Tutor', icon: <Sparkles size={18} />, path: '/aitutor' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col px-5 py-6 h-screen sticky top-0 flex-shrink-0">
      {/* Platform Branding */}
      <div className="flex items-center gap-2.5 px-3 mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-500/10 text-white">
          <Sparkles size={16} className="fill-white" />
        </div>
        <span className="text-xl font-black text-slate-950 tracking-tight">Study<span className="text-blue-600">AI</span></span>
      </div>
      
      {/* Dynamic Module Nav */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-semibold group ${
                isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ring-2 ${
                  isActive ? 'bg-white ring-blue-600 animate-pulse' : 'bg-red-500 ring-white animate-bounce'
                }`} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Account Termination Link */}
      <button 
        onClick={() => { localStorage.clear(); navigate('/login'); }} 
        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all font-semibold text-sm mt-auto"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;