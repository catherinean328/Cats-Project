'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Users, Clock, ArrowLeft, Heart, Phone, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { QueueAPI } from '@/lib/api';
import { useQueuePolling } from '@/hooks/useQueuePolling';

const VenterPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser('venter');
  const [isInQueue, setIsInQueue] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<any>(null);

  // Use polling for real-time updates
  const { queueStatus } = useQueuePolling({
    enabled: true,
    onConnectionFound: (connection) => {
      if (connection.venterUser.sessionId === user?.id) {
        setCurrentConnection(connection);
        setIsInQueue(false);
        toast.success('Connected with a compassionate listener!');
        toast('You can now call them on Telegram!', {
          duration: 5000,
          icon: '📞',
        });
      }
    },
    onError: (error) => {
      console.error('Polling error:', error);
    },
  });

  // Open Telegram to call the listener
  const openTelegramCall = () => {
    if (!currentConnection?.listenerUser?.telegramUsername) {
      toast.error('Listener information not available');
      return;
    }
    
    const telegramUsername = currentConnection.listenerUser.telegramUsername.replace('@', '');
    const telegramUrl = `tg://resolve?domain=${telegramUsername}`;
    const webTelegramUrl = `https://t.me/${telegramUsername}`;
    
    // Try to open native Telegram app first, fallback to web
    const link = document.createElement('a');
    link.href = telegramUrl;
    link.click();
    
    // Also provide web fallback
    setTimeout(() => {
      if (!document.hidden) {
        window.open(webTelegramUrl, '_blank');
      }
    }, 1000);
    
    toast.success('Opening Telegram to call your listener!');
  };

  // Join the venter queue
  const joinQueue = async () => {
    if (!user) return;

    try {
      setIsInQueue(true);
      toast.loading('Looking for a caring listener...');

      const response = await QueueAPI.joinQueue('venter');
      
      toast.dismiss();
      toast.success('Added to queue!');

      if (response.matched && response.connection) {
        setCurrentConnection(response.connection);
        setIsInQueue(false);
        toast.success('Immediately matched with a listener!');
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
      toast('Left the queue', { icon: '👋' });
    } catch (error) {
      toast.error('Failed to leave queue');
    }
  };

  // End current connection
  const endConnection = async () => {
    if (currentConnection) {
      try {
        await QueueAPI.endConnection(currentConnection.id);
        setCurrentConnection(null);
        toast.success('Connection ended. Take care of yourself! 💜');
        
        // Show follow-up message
        setTimeout(() => {
          toast('Remember: You are heard and you matter ❤️', {
            duration: 5000,
            icon: '🌟',
          });
        }, 2000);
      } catch (error) {
        toast.error('Failed to end connection');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your safe space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Venting Space</h1>
              <p className="text-sm text-gray-600">Your safe place to be heard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Connection Interface */}
        {currentConnection && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listener Found!</h2>
              
              <p className="text-gray-600 mb-4">
                You&apos;ve been matched with a caring listener. Click the button below to call them on Telegram.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📞 Ready to Connect</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Your listener is waiting for your call on Telegram: <strong>{currentConnection.listenerUser.telegramUsername}</strong>
                </p>
                <p className="text-xs text-blue-700">
                  The call will open in your Telegram app. Make sure you have Telegram installed.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={openTelegramCall}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
                >
                  <Phone className="w-5 h-5 inline mr-2" />
                  Vent Now
                </button>
                
                <button
                  onClick={endConnection}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                >
                  End Connection
                </button>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 mb-2">💜 Remember</h3>
                <ul className="text-sm text-purple-800 space-y-1 text-left">
                  <li>• Your feelings are valid and important</li>
                  <li>• This is a judgment-free space</li>
                  <li>• Take your time to express yourself</li>
                  <li>• The listener is here to support you</li>
                  <li>• You have the strength to get through this</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Queue Status */}
        {!currentConnection && (
          <div className="text-center">
            {!isInQueue ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Share?</h2>
                
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Sometimes we all need someone to listen. You&apos;re about to connect with a caring listener 
                  who&apos;s here to provide a safe, judgment-free space for you to express yourself.
                </p>
                
                <button
                  onClick={joinQueue}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
                >
                  <Heart className="w-5 h-5 inline mr-2" />
                  Find a Listener
                </button>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Safe & Secure</h3>
                    <p className="text-sm text-gray-600">Complete anonymity and privacy</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Judgment Free</h3>
                    <p className="text-sm text-gray-600">Express yourself without fear</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Caring Listeners</h3>
                    <p className="text-sm text-gray-600">People who genuinely want to help</p>
                  </div>
                </div>
                
                <div className="mt-8 bg-amber-50 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-amber-800">
                    <strong>💡 Tip:</strong> If you&apos;re in crisis, please contact emergency services or a crisis hotline. 
                    This platform is for peer support, not professional mental health treatment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Finding Your Listener</h2>
                
                <p className="text-gray-600 mb-8">
                  We&apos;re connecting you with someone who cares and wants to listen. 
                  Your conversation will be completely private and anonymous.
                </p>
                
                {queueStatus && (
                  <div className="bg-purple-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                    <h3 className="font-semibold text-purple-900 mb-4">Queue Status</h3>
                    <div className="space-y-2 text-sm text-purple-800">
                      <div className="flex justify-between">
                        <span>Your position:</span>
                        <span className="font-medium">#{queueStatus.venters.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Venters waiting:</span>
                        <span className="font-medium">{queueStatus.venters.count}</span>
                      </div>
                      <div className="border-t border-purple-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span>Available listeners:</span>
                          <span className="font-medium text-green-700">{queueStatus.listeners.count}</span>
                        </div>
                      </div>
                      {queueStatus.listeners.data.length > 0 && (
                        <div className="border-t border-purple-200 pt-2 mt-2">
                          <span className="font-medium text-purple-900">Online Listeners:</span>
                          <div className="mt-1 space-y-1">
                            {queueStatus.listeners.data.map((listener, index) => (
                              <div key={listener.id} className="text-xs bg-purple-100 rounded px-2 py-1">
                                {listener.username || `Listener ${index + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">While you wait...</h3>
                  <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
                    <ul className="text-sm text-blue-800 space-y-2 text-left">
                      <li>• Take a few deep breaths</li>
                      <li>• Think about what you&apos;d like to share</li>
                      <li>• Remember: you&apos;re taking a brave step</li>
                      <li>• Your feelings matter and are valid</li>
                    </ul>
                  </div>
                </div>
                
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

export default VenterPage;