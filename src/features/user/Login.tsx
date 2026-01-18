import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useDispatch } from 'react-redux';
import { setUser } from './userSlice';
import { AppDispatch } from '../../store';
import Button from '../../ui/Button';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          dispatch(setUser({
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata.username || email.split('@')[0],
          }));
          navigate('/menu');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
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
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-stone-800">
            {isLogin ? 'Welcome ' : 'Join '} 
            <span className="text-pizza-500">Back</span>
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {isLogin ? 'Sign in to start ordering your favorite pizza' : 'Create an account to save your favorite orders'}
          </p>
        </div>

        <div className="island-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">Username</label>
                  <div className="relative group">
                    <UserPlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-pizza-500 transition-colors" />
                    <input
                      type="text"
                      required
                      className="auth-input w-full rounded-2xl bg-stone-50 border border-stone-100 py-3.5 pl-12 pr-4 text-stone-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="PizzaLover99"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">Email Address</label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-pizza-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="auth-input w-full rounded-2xl bg-stone-50 border border-stone-100 py-3.5 pl-12 pr-4 text-stone-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">Password</label>
              <div className="relative group">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-pizza-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="auth-input w-full rounded-2xl bg-stone-50 border border-stone-100 py-3.5 pl-12 pr-4 text-stone-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                <div className="flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : (
                    <>
                      {isLogin ? <ArrowRightOnRectangleIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-stone-500 hover:text-pizza-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
