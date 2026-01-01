import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeCollaboration = ({ roomId, userId, userName, className = '' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [sharedScreen, setSharedScreen] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pointer');
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    totalParticipants: 0,
    messagesExchanged: 0,
    annotationsMade: 0
  });

  const wsRef = useRef(null);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);
  const lastPingRef = useRef(Date.now());

  // WebSocket connection management
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectWebSocket = useCallback(() => {
    try {
      // In a real app, this would connect to your WebSocket server
      // wsRef.current = new WebSocket(`ws://localhost:8080/collaboration/${roomId}`);
      
      // Mock WebSocket behavior for demonstration
      const mockConnection = {
        send: (data) => {
          console.log('Sending:', JSON.parse(data));
          // Simulate echo back for demo
          setTimeout(() => {
            handleMockMessage(JSON.parse(data));
          }, 100);
        },
        close: () => console.log('Connection closed'),
        readyState: 1 // OPEN
      };
      
      wsRef.current = mockConnection;
      setIsConnected(true);
      
      // Simulate initial room state
      setTimeout(() => {
        setParticipants([
          { id: userId, name: userName, role: 'moderator', joinedAt: new Date(), isActive: true },
          { id: 'user_2', name: 'Sarah Chen', role: 'participant', joinedAt: new Date(Date.now() - 300000), isActive: true },
          { id: 'user_3', name: 'Alex Kumar', role: 'participant', joinedAt: new Date(Date.now() - 180000), isActive: false }
        ]);
        
        setMessages([
          {
            id: 'msg_1',
            userId: 'system',
            userName: 'System',
            content: 'Welcome to the collaborative study session!',
            timestamp: new Date(Date.now() - 600000),
            type: 'system'
          },
          {
            id: 'msg_2',
            userId: 'user_2',
            userName: 'Sarah Chen',
            content: 'Hey everyone! Ready to tackle Module 7?',
            timestamp: new Date(Date.now() - 300000),
            type: 'chat'
          }
        ]);
      }, 1000);
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionQuality('poor');
    }
  }, [roomId, userId, userName]);

  const handleMockMessage = (data) => {
    switch (data.type) {
      case 'chat':
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}`,
          userId: data.userId,
          userName: data.userName,
          content: data.content,
          timestamp: new Date(),
          type: 'chat'
        }]);
        setSessionStats(prev => ({ ...prev, messagesExchanged: prev.messagesExchanged + 1 }));
        break;
      case 'user_activity':
        setActiveUsers(data.activeUsers || []);
        break;
      case 'annotation':
        setAnnotations(prev => [...prev, data.annotation]);
        setSessionStats(prev => ({ ...prev, annotationsMade: prev.annotationsMade + 1 }));
        break;
      case 'cursor_position':
        updateCursorPosition(data.userId, data.position);
        break;
    }
  };

  const sendMessage = (messageData) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(messageData));
    }
  };

  const handleSendChatMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessage({
      type: 'chat',
      userId,
      userName,
      content: newMessage,
      timestamp: new Date()
    });
    
    setNewMessage('');
  };

  const startScreenShare = async () => {
    try {
      // In a real app, this would use WebRTC screen sharing
      setSharedScreen({
        userId,
        userName,
        startTime: new Date(),
        type: 'screen'
      });
      
      sendMessage({
        type: 'screen_share_start',
        userId,
        userName
      });
      
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };

  const stopScreenShare = () => {
    setSharedScreen(null);
    sendMessage({
      type: 'screen_share_stop',
      userId
    });
  };

  const addAnnotation = (x, y, tool, color = '#3b82f6') => {
    const annotation = {
      id: `annotation_${Date.now()}`,
      userId,
      userName,
      type: tool,
      position: { x, y },
      color,
      timestamp: new Date()
    };
    
    setAnnotations(prev => [...prev, annotation]);
    
    sendMessage({
      type: 'annotation',
      annotation
    });
  };

  const updateCursorPosition = (userId, position) => {
    setActiveUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, cursorPosition: position }
        : user
    ));
  };

  const getConnectionStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'green';
      case 'good': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const renderParticipantsList = () => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
        <span className="mr-2">👥</span>
        Participants ({participants.length})
      </h4>
      
      <div className="space-y-2">
        {participants.map(participant => (
          <div key={participant.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {participant.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                  participant.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{participant.name}</p>
                <p className="text-xs text-gray-500">
                  {participant.isActive ? 'Active now' : 'Away'}
                </p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              participant.role === 'moderator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {participant.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderToolbar = () => (
    <div className="bg-white rounded-lg border p-3 mb-4">
      <h4 className="font-semibold text-gray-800 mb-3">🛠️ Collaboration Tools</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={sharedScreen ? stopScreenShare : startScreenShare}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm transition-colors ${
            sharedScreen 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <span>📺</span>
          <span>{sharedScreen ? 'Stop Share' : 'Share Screen'}</span>
        </button>
        
        <button
          onClick={() => setCurrentTool(currentTool === 'pointer' ? 'pen' : 'pointer')}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm transition-colors ${
            currentTool === 'pen'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>✏️</span>
          <span>Annotate</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
          <span>📁</span>
          <span>Files</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
          <span>🎥</span>
          <span>Video Call</span>
        </button>
      </div>
      
      {/* Tool Options */}
      {currentTool === 'pen' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Color:</span>
            {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {/* Set annotation color */}}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderSharedScreen = () => (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📺</span>
          {sharedScreen?.userName}&apos;s Screen
        </h4>
        {sharedScreen?.userId === userId && (
          <button
            onClick={stopScreenShare}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
          >
            Stop Sharing
          </button>
        )}
      </div>
      
      <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseMove={(e) => {
            if (currentTool === 'pen' && isDrawing) {
              const rect = e.currentTarget.getBoundingClientRect();
              addAnnotation(
                e.clientX - rect.left,
                e.clientY - rect.top,
                'draw'
              );
            }
          }}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
        />
        
        {/* Mock shared screen content */}
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🖥️</div>
          <p className="text-lg font-medium">Screen Share Active</p>
          <p className="text-sm">Biology Module 7 - Infectious Disease</p>
        </div>
        
        {/* Annotations */}
        {annotations.map(annotation => (
          <div
            key={annotation.id}
            className="absolute pointer-events-none"
            style={{
              left: annotation.position.x,
              top: annotation.position.y,
              color: annotation.color
            }}
          >
            {annotation.type === 'pointer' && '👆'}
            {annotation.type === 'draw' && (
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: annotation.color }}
              />
            )}
          </div>
        ))}
        
        {/* User cursors */}
        {activeUsers.map(user => (
          user.cursorPosition && user.id !== userId && (
            <div
              key={user.id}
              className="absolute pointer-events-none"
              style={{
                left: user.cursorPosition.x,
                top: user.cursorPosition.y
              }}
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs bg-black text-white px-1 rounded">
                  {user.name}
                </span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="bg-white rounded-lg border flex flex-col h-80">
      <div className="p-3 border-b">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <span className="mr-2">💬</span>
          Group Chat
        </h4>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              message.type === 'system' 
                ? 'text-center' 
                : message.userId === userId 
                  ? 'flex justify-end' 
                  : 'flex justify-start'
            }`}
          >
            {message.type === 'system' ? (
              <div className="bg-gray-100 text-gray-600 text-sm py-2 px-3 rounded-lg">
                {message.content}
              </div>
            ) : (
              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                message.userId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.userId !== userId && (
                  <p className="text-xs opacity-75 mb-1">{message.userName}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendChatMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderSessionStats = () => (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
        <span className="mr-2">📊</span>
        Session Stats
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600">{Math.floor((new Date() - sessionStats.startTime) / 60000)}</p>
          <p className="text-xs text-gray-600">Minutes Active</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{sessionStats.messagesExchanged}</p>
          <p className="text-xs text-gray-600">Messages</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">{sessionStats.annotationsMade}</p>
          <p className="text-xs text-gray-600">Annotations</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-600">{participants.length}</p>
          <p className="text-xs text-gray-600">Participants</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Real-Time Collaboration</h2>
            <p className="text-gray-600">Study together in real-time</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${getConnectionStatusColor()}-500 ${isConnected ? 'animate-pulse' : ''}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Room: {roomId}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Collaboration Area */}
        <div className="lg:col-span-2 space-y-4">
          {renderToolbar()}
          {sharedScreen && renderSharedScreen()}
          {renderChat()}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {renderParticipantsList()}
          {renderSessionStats()}
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-gray-800 mb-3">⚡ Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                📋 Share Study Plan
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors">
                📊 Start Quiz Battle
              </button>
              <button className="w-full bg-purple-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-purple-600 transition-colors">
                🎯 Set Group Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaboration;
