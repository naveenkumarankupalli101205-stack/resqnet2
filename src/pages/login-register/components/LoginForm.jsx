import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setErrors({ 
            general: 'Invalid email or password. Please try again.' 
          });
        } else if (error?.message?.includes('Failed to fetch')) {
          setErrors({ 
            general: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          });
        } else {
          setErrors({ 
            general: error?.message || 'Login failed. Please try again.' 
          });
        }
        return;
      }

      if (data?.user) {
        onSuccess(data?.user);
        
        // Navigate based on user role (will be determined by profile)
        navigate('/victim-dashboard');
      }

    } catch (error) {
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData?.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    // In a real app, you'd implement password reset here alert('Password reset functionality would be implemented here.');
  };

  const fillDemoCredentials = (userType) => {
    const demoCredentials = {
      victim: { email: 'victim@resqnet.com', password: 'victim123' },
      volunteer: { email: 'volunteer@resqnet.com', password: 'volunteer123' },
      admin: { email: 'admin@resqnet.com', password: 'admin123' }
    };
    
    const credentials = demoCredentials?.[userType];
    if (credentials) {
      setFormData(prev => ({
        ...prev,
        email: credentials?.email,
        password: credentials?.password
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-start">
            <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-destructive whitespace-pre-line">
              {errors?.general}
            </div>
          </div>
        </div>
      )}

      {/* Demo Credentials Section */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-blue-700">Victim: victim@resqnet.com / victim123</span>
            <button
              type="button"
              onClick={() => fillDemoCredentials('victim')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Use
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-700">Volunteer: volunteer@resqnet.com / volunteer123</span>
            <button
              type="button"
              onClick={() => fillDemoCredentials('volunteer')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Use
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-700">Admin: admin@resqnet.com / admin123</span>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="w-full"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
        />

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        fullWidth
        className="bg-primary hover:bg-primary/90"
      >
        Sign In
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            onClick={() => {
              const registerTab = document.querySelector('[data-tab="register"]');
              if (registerTab) registerTab?.click();
            }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;