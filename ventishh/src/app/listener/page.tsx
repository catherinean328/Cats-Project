'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, Users, Clock, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { QueueAPI, ActiveConnection } from '@/lib/api';
import { useQueuePolling } from '@/hooks/useQueuePolling';

const ListenerPage = () => {
  const router = useRouter();
  const { user, isLoading, updateUserTelegramUsername } = useUser('listener');
  const [isInQueue, setIsInQueue] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<ActiveConnection | null>(null);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [showTelegramInput, setShowTelegramInput] = useState(false);

  // Use polling for real-time updates
  const { queueStatus } = useQueuePolling({
    enabled: true,
    onConnectionFound: (connection) => {
      if (connection.listenerUser.sessionId === user?.id) {
        setCurrentConnection(connection);
        setIsInQueue(false);
        toast.success('Connected with someone who needs to talk!');
        toast('They will contact you on Telegram shortly!', {
          duration: 5000,
          icon: '📞',
        });
      }
    },
    onError: (err) => {
      console.error('Polling error:', err);
    },
  });

  // Initialize telegram username from user data
  useEffect(() => {
    if (user?.telegramUsername) {
      setTelegramUsername(user.telegramUsername);
    }
  }, [user]);

  // Handle telegram username submission
  const handleTelegramSubmit = () => {
    if (!telegramUsername.trim()) {
      toast.error('Please enter your Telegram username');
      return;
    }
    
    if (!telegramUsername.startsWith('@')) {
      toast.error('Telegram username should start with @');
      return;
    }
    
    updateUserTelegramUsername(telegramUsername);
    setShowTelegramInput(false);
    joinQueue();
  };

  // Join the listener queue
  const joinQueue = async () => {
    if (!user || !user.telegramUsername) return;

    try {
      setIsInQueue(true);
      toast.loading('Joining listener queue...');

      const response = await QueueAPI.joinQueue('listener', user.telegramUsername);
      
      toast.dismiss();
      toast.success('You\'re now available to help others!');

      if (response.matched && response.connection) {
        setCurrentConnection(response.connection);
        setIsInQueue(false);
        toast.success('Immediately matched with someone who needs to talk!');
      }

    } catch (error) {
      setIsInQueue(false);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to join queue');
    }
  };

  // Leave the queue
  const leaveQueue = async () => {
    try {
      await QueueAPI.leaveQueue();
      setIsInQueue(false);
      toast('You\'re no longer available', { icon: '👋' });
    } catch {
      toast.error('Failed to leave queue');
    }
  };

  // Handle starting to listen (show telegram input or join queue)
  const handleStartListening = () => {
    if (!user?.telegramUsername) {
      setShowTelegramInput(true);
    } else {
      joinQueue();
    }
  };

  // End current connection
  const endConnection = async () => {
    if (currentConnection) {
      try {
        await QueueAPI.endConnection(currentConnection.id);
        setCurrentConnection(null);
        toast.success('Connection ended. Thank you for listening!');
        
        // Optionally rejoin queue
        setTimeout(() => {
          toast('Ready to help someone else?', {
            duration: 4000,
            icon: '💙',
          });
        }, 2000);
      } catch {
        toast.error('Failed to end connection');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your listening session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Listener Mode</h1>
              <p className="text-sm text-gray-600">Ready to help others</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Connection Interface */}
        {currentConnection && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connected!</h2>
              
              <p className="text-gray-600 mb-6">
                A venter has been matched with you. They will call you on Telegram at <strong>{user?.telegramUsername}</strong>
              </p>
              
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">📞 Expecting Telegram Call</h3>
                <p className="text-sm text-green-800">
                  The venter will initiate a voice call through Telegram. Please keep your Telegram app ready and answer when they call.
                </p>
              </div>
              
              <button
                onClick={endConnection}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
              >
                End Connection
              </button>
              
              <div className="bg-blue-50 rounded-xl p-4 mt-6">
                <h3 className="font-semibold text-blue-900 mb-2">💙 Listening Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Listen without judgment</li>
                  <li>• Let them express themselves fully</li>
                  <li>• Ask gentle, open-ended questions</li>
                  <li>• Validate their feelings</li>
                  <li>• Be patient and present</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Telegram Username Input */}
        {showTelegramInput && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Telegram</h2>
              
              <p className="text-gray-600 mb-6">
                To receive calls from venters, please provide your Telegram username. 
                This will be shared with people who need someone to talk to.
              </p>
              
              <div className="max-w-md mx-auto mb-6">
                <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Username
                </label>
                <input
                  id="telegram"
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@yourusername"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg text-black"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Make sure this matches your exact Telegram username (including @)
                </p>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => setShowTelegramInput(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTelegramSubmit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Start Listening
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Queue Status */}
        {!currentConnection && (
          <div className="text-center">
            {!isInQueue ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Listen?</h2>
                
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  By joining the queue, you&apos;ll be available to provide a compassionate ear to someone 
                  who needs to be heard. Your kindness makes a difference.
                </p>
                
                <button
                  onClick={handleStartListening}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
                >
                  <Heart className="w-5 h-5 inline mr-2" />
                  Start Listening
                </button>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Make a Difference</h3>
                    <p className="text-sm text-gray-600">Help someone feel heard and valued</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Anonymous</h3>
                    <p className="text-sm text-gray-600">Complete privacy for both parties</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible</h3>
                    <p className="text-sm text-gray-600">Join and leave whenever you want</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Waiting to Help</h2>
                
                <p className="text-gray-600 mb-8">
                  You&apos;re now available to listen. We&apos;ll connect you with someone who needs support.
                </p>
                
                {queueStatus && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                    <h3 className="font-semibold text-blue-900 mb-4">Queue Status</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Total listeners:</span>
                        <span className="font-medium">{queueStatus.listeners.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Venters waiting:</span>
                        <span className="font-medium text-purple-700">{queueStatus.venters.count}</span>
                      </div>
                      {queueStatus.venters.count > 0 && (
                        <div className="border-t border-blue-200 pt-2 mt-2">
                          <span className="font-medium text-blue-900">Waiting Venters:</span>
                          <div className="mt-1">
                            <div className="text-xs bg-blue-100 rounded px-2 py-1">
                              {queueStatus.venters.count} people need support
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={leaveQueue}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                >
                  Leave Queue
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListenerPage;