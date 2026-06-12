import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, ArrowLeft, Trash2, ShieldAlert, MessageCircle } from 'lucide-react';

const Chat = ({ receiver, onBack, socket }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!receiver?._id) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`https://study-finder-ai.onrender.com/api/messages/${receiver._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChatHistory(res.data);
            } catch (err) {
                console.error("Error loading history:", err);
            }
        };

        fetchHistory();
        
        if (socket && receiver?._id && currentUser?._id) {
            socket.emit('join_chat', { userId: currentUser._id, receiverId: receiver._id });

            socket.on('receive_message', (data) => {
                if (data.senderId === receiver._id || data.senderId === currentUser._id) {
                    setChatHistory((prev) => {
                        if (prev.some(m => m._id === data._id)) return prev;
                        return [...prev, data];
                    });
                }
            });

            socket.on('message_deleted', (data) => {
                setChatHistory((prev) => prev.filter(m => m._id !== data.id));
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_message');
                socket.off('message_deleted');
            }
        };
    }, [receiver, socket, currentUser?._id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleDeleteMessage = async (msgId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`https://study-finder-ai.onrender.com/api/messages/${msgId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200 || res.data) {
                setChatHistory(prev => prev.filter(m => m._id !== msgId));
                if (socket) {
                    socket.emit('delete_message', { 
                        id: msgId, 
                        senderId: currentUser._id, 
                        receiverId: receiver._id 
                    });
                }
            }
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://study-finder-ai.onrender.com/api/messages', 
                { receiverId: receiver._id, message: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setChatHistory(prev => [...prev, res.data]);
            if (socket) {
                socket.emit('send_message', res.data);
            }
            setMessage('');
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden text-slate-500 hover:text-slate-900 transition mr-1"><ArrowLeft size={20} /></button>
                    <div className="relative">
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm shadow-blue-500/10 uppercase text-sm">
                            {receiver?.name?.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm tracking-tight">{receiver?.name}</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Peer Room Session Active</p>
                    </div>
                </div>
            </div>

            {/* Message History Scroller */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#f8fafc]/40">
                {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 mb-3">
                            <MessageCircle size={20} className="stroke-[1.5]" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900">Secure Thread Created</p>
                        <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5">Say hello to initialize matching module conversations.</p>
                    </div>
                ) : (
                    chatHistory.map((msg) => {
                        const isSelf = msg.senderId === currentUser._id;
                        return (
                            <div key={msg._id} className={`flex group ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[75%] ${isSelf ? 'flex-row' : 'flex-row-reverse'}`}>
                                    
                                    {isSelf && (
                                        <button 
                                            onClick={() => handleDeleteMessage(msg._id)} 
                                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 mb-1"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}

                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                        isSelf 
                                        ? 'bg-slate-950 text-white rounded-br-none shadow-sm shadow-slate-950/5 font-normal' 
                                        : 'bg-white text-slate-700 border border-slate-200/60 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Action Panel */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2.5 items-center flex-shrink-0">
                <input 
                    className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 text-sm transition-all placeholder:text-slate-400 font-medium"
                    placeholder={`Message ${receiver?.name || 'peer'}...`} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all active:scale-95 disabled:opacity-40 flex-shrink-0" 
                    disabled={!message.trim()}
                >
                    <Send size={16} className="stroke-[2.5]" />
                </button>
            </form>
        </div>
    );
};

export default Chat;