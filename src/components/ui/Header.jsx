import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login-register');
    }
  };

  const getPageTitle = () => {
    switch (location?.pathname) {
      case '/victim-dashboard':
        return 'Victim Dashboard';
      case '/volunteer-dashboard':
        return 'Volunteer Dashboard';
      case '/user-profile':
        return 'My Profile';
      case '/alert-history':
        return 'Alert History';
      case '/home-landing':
        return 'ResqNet';
      default:
        return 'ResqNet';
    }
  };

  const isAuthPage = location?.pathname === '/login-register';

  if (isAuthPage) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Icon name="Shield" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ResqNet</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Icon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ResqNet</h1>
            <p className="text-sm text-gray-600">{getPageTitle()}</p>
          </div>
        </div>

        {/* Navigation and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              {userProfile?.role === 'victim' && (
                <>
                  <button
                    onClick={() => navigate('/victim-dashboard')}
                    className={`text-sm font-medium transition-colors ${
                      location?.pathname === '/victim-dashboard' ?'text-red-600' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/alert-history')}
                    className={`text-sm font-medium transition-colors ${
                      location?.pathname === '/alert-history' ?'text-red-600' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    History
                  </button>
                </>
              )}
              
              {userProfile?.role === 'volunteer' && (
                <>
                  <button
                    onClick={() => navigate('/volunteer-dashboard')}
                    className={`text-sm font-medium transition-colors ${
                      location?.pathname === '/volunteer-dashboard' ?'text-red-600' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/alert-history')}
                    className={`text-sm font-medium transition-colors ${
                      location?.pathname === '/alert-history' ?'text-red-600' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Responses
                  </button>
                </>
              )}
              
              <button
                onClick={() => navigate('/user-profile')}
                className={`text-sm font-medium transition-colors ${
                  location?.pathname === '/user-profile' ?'text-red-600' :'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
            </nav>
          )}

          {/* User Menu */}
          {loading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user && userProfile ? (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userProfile?.role}
                </p>
              </div>
              
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile?.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon name="User" className="w-4 h-4 text-gray-600" />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-2"
              >
                <Icon name="LogOut" className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login-register')}
              variant="default"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;