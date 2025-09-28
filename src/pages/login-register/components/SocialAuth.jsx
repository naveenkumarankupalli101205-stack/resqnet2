import React, { useState } from 'react';
import Button from '../../../components/ui/Button';


const SocialAuth = ({ onSuccess = () => {} }) => {
  const [isLoading, setIsLoading] = useState({});

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-600',
      bgColor: 'hover:bg-red-50'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'Apple',
      color: 'text-gray-800',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  const handleSocialLogin = async (providerId) => {
    setIsLoading(prev => ({ ...prev, [providerId]: true }));

    try {
      // Simulate social auth delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock social auth success
      const mockUser = {
        id: Math.random()?.toString(36)?.substr(2, 9),
        name: providerId === 'google' ? 'John Smith' : providerId === 'facebook' ? 'Sarah Wilson' : 'Mike Johnson',
        email: `${providerId}user@example.com`,
        role: 'volunteer', // Default role for social auth
        phone: '+1 (555) 000-0000',
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.01,
          lng: -74.0060 + (Math.random() - 0.5) * 0.01,
          address: '123 Social St, New York, NY'
        },
        emergencyContacts: [
          { name: 'Emergency Contact', phone: '+1 (555) 111-1111', relation: 'Family' }
        ],
        isAvailable: true,
        joinedDate: new Date()?.toISOString(),
        authProvider: providerId
      };

      // Store user data
      localStorage.setItem('resqnet_user', JSON.stringify(mockUser));
      localStorage.setItem('resqnet_token', `${providerId}_token_` + Date.now());

      onSuccess(mockUser);

    } catch (error) {
      console.error(`${providerId} auth failed:`, error);
      alert(`${providerId} authentication failed. Please try again.`);
    } finally {
      setIsLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="default"
            onClick={() => handleSocialLogin(provider?.id)}
            loading={isLoading?.[provider?.id]}
            className={`${provider?.bgColor} border-border hover:border-border/80`}
            iconName={provider?.icon}
            iconPosition="left"
            iconSize={18}
          >
            <span className="hidden sm:inline">{provider?.name}</span>
            <span className="sm:hidden">{provider?.name}</span>
          </Button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;