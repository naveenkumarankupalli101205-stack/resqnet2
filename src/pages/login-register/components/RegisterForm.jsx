import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'victim',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'victim', label: 'I need emergency assistance' },
    { value: 'volunteer', label: 'I want to help others in emergencies' }
  ];

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

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
      const { data, error } = await signUp(
        formData?.email,
        formData?.password,
        {
          fullName: formData?.fullName,
          role: formData?.role,
          phone: formData?.phone
        }
      );
      
      if (error) {
        if (error?.message?.includes('User already registered')) {
          setErrors({ 
            email: 'This email is already registered. Please sign in instead.' 
          });
        } else if (error?.message?.includes('Failed to fetch')) {
          setErrors({ 
            general: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
          });
        } else {
          setErrors({ 
            general: error?.message || 'Registration failed. Please try again.' 
          });
        }
        return;
      }

      if (data?.user) {
        onSuccess(data?.user);
        
        // Show success message or navigate
        alert('Registration successful! Please check your email to confirm your account.');
        
        // Navigate to appropriate dashboard
        if (formData?.role === 'victim') {
          navigate('/victim-dashboard');
        } else {
          navigate('/volunteer-dashboard');
        }
      }

    } catch (error) {
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
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

      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
          className="w-full"
        />

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
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData?.phone}
          onChange={handleInputChange}
          error={errors?.phone}
          required
          className="w-full"
        />

        <Select
          label="I want to:"
          name="role"
          value={formData?.role}
          onChange={handleInputChange}
          options={roleOptions}
          error={errors?.role}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password (min. 6 characters)"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          className="w-full"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          className="w-full"
        />
      </div>

      <Checkbox
        label={
          <span className="text-sm">
            I agree to the{' '}
            <button
              type="button"
              className="text-primary hover:text-primary/80 underline"
              onClick={() => alert('Terms and conditions would be displayed here')}
            >
              Terms and Conditions
            </button>
            {' '}and{' '}
            <button
              type="button"
              className="text-primary hover:text-primary/80 underline"
              onClick={() => alert('Privacy policy would be displayed here')}
            >
              Privacy Policy
            </button>
          </span>
        }
        name="agreeTerms"
        checked={formData?.agreeTerms}
        onChange={handleInputChange}
        error={errors?.agreeTerms}
        required
      />

      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        fullWidth
        className="bg-primary hover:bg-primary/90"
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            onClick={() => {
              const loginTab = document.querySelector('[data-tab="login"]');
              if (loginTab) loginTab?.click();
            }}
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;