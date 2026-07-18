import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';
import authService from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    } catch {
      // error already toasted globally
    }
  };

  return (
    <div className="container-custom py-16 max-w-md">
      <Helmet title="Reset Password | Shreedha Vastra" />
      <h1 className="font-serif text-3xl text-center mb-8">Set a New Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="New Password"
            className="input-field"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="input-field"
            {...register('confirmPassword', { validate: (val) => val === watch('password') || 'Passwords do not match' })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" isLoading={isSubmitting} className="w-full">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
