import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, TextInput, Label, Alert } from 'flowbite-react';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Building2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials, setAuthLoading } from '@/features/auth/authSlice';
import { authService } from '@/features/auth/authService';
import { addNotification } from '@/features/notifications/notificationSlice';
import { getErrorMessage, getValidationErrors } from '@/utils/errors';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setFormError(null);
      setIsSubmitting(true);
      dispatch(setAuthLoading(true));

      const authData = await authService.login(values);

      dispatch(
        setCredentials({
          user: authData.user,
          token: authData.token,
        })
      );

      dispatch(
        addNotification({
          type: 'success',
          title: 'Welcome Back',
          message: `Logged in successfully as ${authData.user.name}.`,
        })
      );

      // Avoid redirecting back to onboarding or login
      const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
      const destination =
        rawFrom && !rawFrom.includes('/login') && !rawFrom.includes('/onboarding')
          ? rawFrom
          : '/dashboard';

      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Invalid credentials. Please try again.');
      const validationErrors = getValidationErrors(err);

      // Check if user has no tenant assigned
      if (message.toLowerCase().includes('no tenant is assigned')) {
        dispatch(
          addNotification({
            type: 'warning',
            title: 'Tenant Required',
            message: 'No company is assigned to this account. Please register your company.',
          })
        );
        navigate('/onboarding/tenant', { replace: true });
        return;
      }

      if (validationErrors) {
        const firstField = Object.keys(validationErrors)[0];
        setFormError(validationErrors[firstField][0]);
      } else {
        setFormError(message);
      }

      dispatch(
        addNotification({
          type: 'error',
          title: 'Authentication Failed',
          message,
        })
      );
    } finally {
      setIsSubmitting(false);
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white font-bold text-2xl shadow-lg shadow-primary-500/30">
            SE
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Smart <span className="text-primary-600">ERP</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to access your enterprise workspace
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-200 shadow-md dark:border-gray-700 dark:bg-gray-800">
          {formError && (
            <Alert color="failure" icon={AlertCircle} className="mb-2">
              <span className="font-medium">Sign in error:</span> {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email Address</Label>
              </div>
              <TextInput
                id="email"
                type="email"
                icon={Mail}
                placeholder="name@company.com"
                color={errors.email ? 'failure' : 'gray'}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with Eye Toggle Icon */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  color={errors.password ? 'failure' : 'gray'}
                  {...register('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Default credentials hint */}
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Default Backend Credentials:
              </div>
              <div>Email: <span className="font-mono text-primary-600 dark:text-primary-400">admin@example.com</span></div>
              <div>Password: <span className="font-mono text-primary-600 dark:text-primary-400">password</span></div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Tenant Onboarding Shortcut */}
          <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need to register a new organization?{' '}
              <Link
                to="/onboarding/tenant"
                className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                <Building2 className="mr-1 h-3.5 w-3.5" />
                Create Company Workspace
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
