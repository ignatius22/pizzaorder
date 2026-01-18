import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Button from '../../ui/Button';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
            Reset <span className="text-pizza-500">Password</span>
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="island-card">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">
                Check your email
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link
                to="/login"
                className="text-sm font-medium text-pizza-500 hover:text-pizza-600 transition-colors"
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-2">
                  Email Address
                </label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-pizza-500 transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm font-medium text-red-500"
                >
                  {error}
                </motion.p>
              )}

              <div className="pt-2">
                <Button type="primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center border-t border-stone-100 dark:border-stone-800 pt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-pizza-600 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
