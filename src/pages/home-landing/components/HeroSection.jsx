import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onSOSClick, onRoleSelect }) => {
  return (
    <div className="relative bg-gradient-to-br from-background via-muted/20 to-background min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mr-4 shadow-emergency-md">
              <Icon name="Shield" size={32} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              ResQNet
            </h1>
          </div>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Community-driven emergency response network connecting those who need help with nearby volunteers
          </p>
        </div>

        {/* Main SOS Button */}
        <div className="mb-12">
          <div className="relative inline-block">
            <button
              onClick={onSOSClick}
              className="w-32 h-32 lg:w-40 lg:h-40 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground rounded-full shadow-emergency-lg hover:shadow-emergency-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30"
              style={{ touchAction: 'manipulation' }}
              aria-label="Emergency SOS Button"
            >
              <div className="flex flex-col items-center justify-center">
                <Icon name="AlertTriangle" size={48} strokeWidth={2.5} className="mb-2" />
                <span className="text-xl lg:text-2xl font-bold">SOS</span>
              </div>
            </button>
            
            {/* Pulse Animation Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20"></div>
          </div>
          
          <p className="mt-4 text-sm lg:text-base text-muted-foreground max-w-md mx-auto">
            Press for immediate emergency assistance from nearby volunteers
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <div 
            onClick={() => onRoleSelect('victim')}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-emergency-sm transition-all duration-200 cursor-pointer hover:border-primary/30 group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">I Need Help</h3>
            <p className="text-sm text-muted-foreground">
              Get immediate assistance from nearby volunteers in emergency situations
            </p>
          </div>

          <div 
            onClick={() => onRoleSelect('volunteer')}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-emergency-sm transition-all duration-200 cursor-pointer hover:border-secondary/30 group"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors duration-200">
              <Icon name="Heart" size={24} className="text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">I Want to Help</h3>
            <p className="text-sm text-muted-foreground">
              Join our volunteer network and help community members in need
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={() => onRoleSelect('login')}
            iconName="LogIn"
            iconPosition="left"
            iconSize={16}
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            size="default"
            onClick={() => onRoleSelect('register')}
            iconName="UserPlus"
            iconPosition="left"
            iconSize={16}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;