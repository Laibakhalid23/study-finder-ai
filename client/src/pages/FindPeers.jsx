import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, MessageCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar'; 
import Chat from '../components/Chat'; 


const FindPeers = ({ socket }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState(null); 

    const performSearch = useCallback(async (term) => {
        if (!term || term.length < 2) {
            setPeers([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(
                `http://https://study-finder-ai.onrender.com/api/users/peers?subject=${term}`, 
                config
            );
            setPeers(res.data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            performSearch(searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, performSearch]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
     
            <Sidebar />

            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    {selectedPeer ? (
                        <div className="h-[600px] animate-in fade-in zoom-in duration-300">
                            
                            <Chat 
                                receiver={selectedPeer} 
                                socket={socket} 
                                onBack={() => setSelectedPeer(null)} 
                            />
                        </div>
                    ) : (
                        <>
                            <header className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-800">Find Study Partners</h2>
                                <p className="text-slate-500">Connect with students learning the same subjects.</p>
                            </header>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                    <input 
                                        type="text"
                                        placeholder="Search subjects (e.g. react, oop)..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loading && (
                                    <div className="col-span-full text-center py-4 text-blue-600 font-medium">Searching...</div>
                                )}
                                
                                {peers.length > 0 ? (
                                    peers.map((peer) => (
                                        <div key={peer._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                                    {peer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{peer.name}</h4>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {peer.subjects.map((s, i) => (
                                                            <span key={i} className="text-[9px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedPeer(peer)} 
                                                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                                            >
                                                <MessageCircle size={20} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    !loading && searchTerm.length >= 2 && (
                                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                                            No study partners found for "{searchTerm}"
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FindPeers;