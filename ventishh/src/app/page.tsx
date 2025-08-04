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
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ventishh
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Safe Space to
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Be Heard
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect anonymously with caring listeners or help others by lending an ear. 
            Sometimes we all need someone to talk to without judgment.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-gray-700">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium">100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mic className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Voice Only</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Judgment Free</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Venter Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I need to vent</h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Feeling overwhelmed? Need someone to listen? Connect with a caring listener 
                  who&apos;s here to provide a safe, judgment-free space for you to express yourself.
                </p>
                
                <button
                  onClick={() => handleRoleSelection('venter')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I want to listen</h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have a compassionate heart? Ready to be someone&apos;s anonymous friend? 
                  Help others by offering your time and attention to those who need to be heard.
                </p>
                
                <button
                  onClick={() => handleRoleSelection('listener')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Role</h4>
              <p className="text-gray-600 text-sm">
                Select whether you want to vent your feelings or listen to others
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Matched</h4>
              <p className="text-gray-600 text-sm">
                Our system anonymously pairs you with someone who complements your role
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">3</span>
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
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              🌟 Live Platform Status
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{queueStatus.listeners.count}</div>
                <div className="text-sm text-gray-600">Online Listeners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{queueStatus.venters.count}</div>
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
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
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