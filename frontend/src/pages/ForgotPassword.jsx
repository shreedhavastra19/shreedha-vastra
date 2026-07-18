import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await authService.forgotPassword(data.email);
    setSent(true);
  };

  return (
    <div className="container-custom py-16 max-w-md">
      <Helmet title="Forgot Password | Shreedha Vastra" />
      <h1 className="font-serif text-3xl text-center mb-4">Forgot Password</h1>
      <p className="text-sm text-center text-charcoal/60 mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {sent ? (
        <p className="text-center text-green-600">
          If an account exists with that email, a reset link has been sent. Please check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input type="email" placeholder="Email address" className="input-field" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full">Send Reset Link</Button>
        </form>
      )}

      <p className="text-center text-sm mt-6">
        <Link to="/login" className="text-gold font-medium hover:underline">Back to Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
