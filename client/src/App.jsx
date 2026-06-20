import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindPeers from './pages/FindPeers';
import AITutor from './pages/AITutor';
import Messages from './pages/Messages';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://study-finder-ai.onrender.com';

const socket = io(BACKEND_URL);

function App() {
  const [unreadSenders, setUnreadSenders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      socket.emit('join_room', user._id);

      const handleReceiveMessage = (data) => {
        const currentChatUrl = `/messages/${data.senderId}`;
        if (window.location.pathname !== currentChatUrl) {
          setUnreadSenders(prev => {
            if (!prev.includes(data.senderId)) {
              return [...prev, data.senderId];
            }
            return prev;
          });
        }
      };

      socket.on('receive_message', handleReceiveMessage);
      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [location.pathname]);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'messages' && pathParts[2]) {
      const activePeerId = pathParts[2];
      setUnreadSenders(prev => prev.filter(id => id !== activePeerId));
    }
  }, [location.pathname]);

  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard unreadCount={unreadSenders.length} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/findpeers" element={<FindPeers unreadCount={unreadSenders.length} socket={socket} />} />
        <Route path="/aitutor" element={<AITutor unreadCount={unreadSenders.length} />} />
        <Route path="/messages" element={<Messages unreadSenders={unreadSenders} setUnreadSenders={setUnreadSenders} socket={socket} />} />
        <Route path="/messages/:peerId" element={<Messages unreadSenders={unreadSenders} setUnreadSenders={setUnreadSenders} socket={socket} />} />
      </Routes>
    </div>
  );
}

export default App;