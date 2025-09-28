import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TrustSignals from './components/TrustSignals';
import SocialAuth from './components/SocialAuth';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('resqnet_user');
    const storedToken = localStorage.getItem('resqnet_token');
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Redirect to appropriate dashboard
      if (userData?.role === 'victim') {
        navigate('/victim-dashboard');
      } else {
        navigate('/volunteer-dashboard');
      }
    }

    // Check for remember me preference
    const rememberMe = localStorage.getItem('resqnet_remember');
    if (rememberMe) {
      // Could pre-fill login form here
    }
  }, [navigate]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    
    // Show success message
    const message = activeTab === 'login' 
      ? `Welcome back, ${userData?.name}!` 
      : `Welcome to ResQNet, ${userData?.name}!`;
    
    // Could show toast notification here
    console.log(message);
  };

  const tabs = [
    {
      id: 'login',
      label: 'Sign In',
      icon: 'LogIn',
      description: 'Access your emergency network account'
    },
    {
      id: 'register',
      label: 'Sign Up',
      icon: 'UserPlus',
      description: 'Join the community emergency response network'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/home-landing')}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Icon name="Shield" size={20} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-foreground">ResQNet</span>
            </div>
            
            <button
              onClick={() => navigate('/home-landing')}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name="ArrowLeft" size={16} className="mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Auth Forms */}
          <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {activeTab === 'login' ? 'Welcome Back' : 'Join ResQNet'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {activeTab === 'login' ?'Sign in to access your emergency response network' :'Create your account and become part of the community safety network'
                }
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-muted/30 p-1 rounded-lg">
              <div className="grid grid-cols-2 gap-1">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    data-tab={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center justify-center px-4 py-3 rounded-md transition-all duration-200
                      ${activeTab === tab?.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={18} className="mr-2" />
                    <span className="font-medium">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Forms */}
            <div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
              {activeTab === 'login' ? (
                <LoginForm onSuccess={handleAuthSuccess} />
              ) : (
                <RegisterForm onSuccess={handleAuthSuccess} />
              )}
            </div>

            {/* Social Authentication */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <SocialAuth onSuccess={handleAuthSuccess} />
            </div>
          </div>

          {/* Right Column - Trust Signals & Information */}
          <div className="space-y-8">
            <TrustSignals />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center mr-2">
                  <Icon name="Shield" size={14} color="white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-foreground">ResQNet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting communities through emergency response networks. 
                Building safer neighborhoods, one connection at a time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/home-landing')}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Home
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  How It Works
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Safety Guidelines
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Community Guidelines
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Help Center
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Contact Support
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Privacy Policy
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} ResQNet. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icon name="Shield" size={14} className="mr-1 text-success" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icon name="CheckCircle" size={14} className="mr-1 text-success" />
                  <span>Emergency Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginRegister;