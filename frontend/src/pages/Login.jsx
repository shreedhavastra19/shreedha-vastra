import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      const fallback = isAdmin ? '/admin' : '/';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch {
      // error already toasted globally by the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-16 max-w-md">
      <Helmet title="Login | Shreedha Vastra" />
      <h1 className="font-serif text-3xl text-center mb-8">Welcome Back</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full">Log In</Button>
      </form>

      <p className="text-center text-sm mt-6">
        Don't have an account? <Link to="/register" className="text-gold font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
