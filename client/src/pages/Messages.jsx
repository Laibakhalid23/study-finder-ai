import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

const Messages = ({ unreadSenders = [], setUnreadSenders, socket }) => {
    const { peerId } = useParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedPeer, setSelectedPeer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://https://study-finder-ai.onrender.com/api/messages/conversations', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(res.data);
                
                if (peerId) {
                    const peer = res.data.find(p => p._id === peerId);
                    if (peer) {
                        setSelectedPeer(peer);
                        // Clear notification for this user immediately upon selection
                        if (setUnreadSenders) {
                            setUnreadSenders(prev => prev.filter(id => id !== peerId));
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [peerId, setUnreadSenders]);

    return (
        <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
          
            <Sidebar unreadCount={unreadSenders.length} />
            
            <main className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex bg-white m-4 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    
                    {/* Sidebar: Users List */}
                    <div className={`${selectedPeer ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-slate-100 flex-col bg-white`}>
                        <div className="p-6 border-b border-slate-50">
                            <h2 className="text-2xl font-bold text-slate-800">Messages</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-slate-400 italic">Loading...</div>
                            ) : conversations.length > 0 ? (
                                conversations.map((peer) => {
                                   
                                    const isUnread = unreadSenders.includes(peer._id);

                                    return (
                                        <div 
                                            key={peer._id}
                                            onClick={() => {
                                                setSelectedPeer(peer);
                                                navigate(`/messages/${peer._id}`);
                                            }}
                                            className={`p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-blue-50/50 ${selectedPeer?._id === peer._id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                                        >
                                            <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex-shrink-0 flex items-center justify-center font-bold relative">
                                                {peer.name.charAt(0).toUpperCase()}
                                               
                                                {isUnread && (
                                                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`truncate text-sm ${isUnread ? 'font-black text-slate-950' : 'font-bold text-slate-800'}`}>
                                                        {peer.name}
                                                    </h4>
                                                    
                                                    {isUnread && (
                                                        <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm shadow-blue-500/20 animate-bounce">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs ${isUnread ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                                                    {isUnread ? 'Sent you a message' : 'Click to chat'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-10 text-center text-slate-400 italic text-sm">
                                    No conversations found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`${!selectedPeer ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50/20`}>
                        {selectedPeer ? (
                            <Chat 
                                receiver={selectedPeer} 
                                socket={socket} 
                                onBack={() => {
                                    setSelectedPeer(null);
                                    navigate('/messages');
                                }} 
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400 italic text-sm">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Messages;