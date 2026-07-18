import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
    } catch {
      // error already toasted globally by the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-16 max-w-md">
      <Helmet title="Create Account | Shreedha Vastra" />
      <h1 className="font-serif text-3xl text-center mb-8">Create Your Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input placeholder="Full Name" className="input-field" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email address" className="input-field" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input placeholder="Phone (10 digits)" className="input-field" {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit phone number' } })} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            className="input-field"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full">Create Account</Button>
      </form>

      <p className="text-center text-sm mt-6">
        Already have an account? <Link to="/login" className="text-gold font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
