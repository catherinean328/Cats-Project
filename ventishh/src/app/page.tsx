'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mic, MessageCircle, Shield, Headphones, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useQueuePolling } from '@/hooks/useQueuePolling';

const LandingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use polling to get real-time queue status
  const { queueStatus } = useQueuePolling({
    enabled: true,
    interval: 3000, // Poll every 3 seconds
  });

  // Handle role selection with loading state
  const handleRoleSelection = async (role: 'listener' | 'venter') => {
    setIsLoading(true);
    
    try {
      // Show loading toast
      toast.loading(`Joining as ${role}...`);
      
      // Simulate brief loading (in real app, this would be authentication/session setup)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to appropriate page
      router.push(`/${role}`);
      
      toast.dismiss();
      toast.success(`Welcome, ${role}!`);
    } catch {
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-white/70 backdrop-blur rounded-2xl flex items-center justify-center shadow-md border border-white/50 animate-[float_6s_ease-in-out_infinite]">
              <Heart className="w-6 h-6" style={{ color: '#DBABCA' }} />
            </div>
            <h1
              className="text-3xl font-extrabold font-display tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #DBABCA, #998CBA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ventishh
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-display">
            Your Safe Space to
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #DBABCA, #998CBA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Be Heard
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect anonymously with caring listeners or help others by lending an ear. 
            Sometimes we all need someone to talk to without judgment.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-white/60">
              <Shield className="w-5 h-5" style={{ color: '#D8BFD8' }} />
              <span className="font-medium">100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-white/60">
              <Mic className="w-5 h-5" style={{ color: '#E6C7A6' }} />
              <span className="font-medium">Voice Only</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-white/60">
              <Heart className="w-5 h-5" style={{ color: '#DBABCA' }} />
              <span className="font-medium">Judgment Free</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Venter Card */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300" style={{ backgroundImage: 'linear-gradient(90deg, #F4C2C2, #DBABCA, #998CBA)' }}></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #F4C2C2, #DBABCA)' }}>
                  <MessageCircle className="w-8 h-8 text-white drop-shadow" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I need to vent</h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Feeling overwhelmed? Need someone to listen? Connect with a caring listener 
                  who&apos;s here to provide a safe, judgment-free space for you to express yourself.
                </p>
                
                <button
                  onClick={() => handleRoleSelection('venter')}
                  disabled={isLoading}
                  className="w-full text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ backgroundImage: 'linear-gradient(90deg, #F4C2C2, #DBABCA, #998CBA)', boxShadow: '0 8px 30px rgba(219,171,202,0.35)' }}
                >
                  {isLoading ? 'Connecting...' : 'Find a Listener'}
                </button>
                
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Join 1,247 others today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Listener Card */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300" style={{ backgroundImage: 'linear-gradient(90deg, #E6C7A6, #FAEAC5, #DBABCA)' }}></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #E6C7A6, #FAEAC5)' }}>
                  <Headphones className="w-8 h-8 text-white drop-shadow" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I want to listen</h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have a compassionate heart? Ready to be someone&apos;s anonymous friend? 
                  Help others by offering your time and attention to those who need to be heard.
                </p>
                
                <button
                  onClick={() => handleRoleSelection('listener')}
                  disabled={isLoading}
                  className="w-full text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ backgroundImage: 'linear-gradient(90deg, #E6C7A6, #FAEAC5, #DBABCA)', boxShadow: '0 8px 30px rgba(230,199,166,0.35)' }}
                >
                  {isLoading ? 'Connecting...' : 'Start Listening'}
                </button>
                
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>Be someone&apos;s hero today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">How Ventishh Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-xl font-bold text-rose-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Role</h4>
              <p className="text-gray-600 text-sm">
                Select whether you want to vent your feelings or listen to others
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-xl font-bold text-sky-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Matched</h4>
              <p className="text-gray-600 text-sm">
                Our system anonymously pairs you with someone who complements your role
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-xl font-bold text-violet-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Connect & Talk</h4>
              <p className="text-gray-600 text-sm">
                Have a private, anonymous voice conversation in a safe space
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Platform Stats */}
      {queueStatus && (
        <div className="mt-16 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 max-w-2xl mx-auto border border-white">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              🌟 Live Platform Status
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-600">{queueStatus.listeners.count}</div>
                <div className="text-sm text-gray-600">Online Listeners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-rose-600">{queueStatus.venters.count}</div>
                <div className="text-sm text-gray-600">Waiting Venters</div>
              </div>
            </div>

            {queueStatus.listeners.data.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-center">
                  Available Listeners
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {queueStatus.listeners.data.map((listener, index) => (
                    <div
                      key={listener.id}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {listener.username || `Listener ${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-4 text-xs text-gray-500">
              Updates every 3 seconds
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-600 border-t border-gray-200">
        <p className="text-sm">
          Made with ❤️ for mental wellness • Anonymous • Secure • Free
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;