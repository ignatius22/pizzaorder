import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { supabase } from '../../services/supabase';
import { updateProfile } from '../../services/apiRestaurant';
import { updateAddress } from './userSlice';
import Button from '../../ui/Button';
import { 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const { id: userId, username: reduxUsername, email, address: reduxAddress } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState(reduxUsername);
  const [address, setAddress] = useState(reduxAddress);
  const [phone, setPhone] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) {
          console.error('Profile fetch error:', fetchError);
          // Profile might not exist, use Redux values as fallback
        }

        if (data) {
          setUsername(data.username || reduxUsername);
          setAddress(data.address || reduxAddress);
          setPhone(data.phone || '');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfile();
  }, [userId, reduxUsername, reduxAddress]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setIsLoading(true);
    setIsSuccess(false);
    setError('');

    try {
      await updateProfile(userId, {
        username,
        address,
        phone,
      });
      dispatch(updateAddress(address));
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="py-8">
        <h2 className="mb-10 font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
          User <span className="text-pizza-500">Profile</span>
        </h2>
        <div className="island-card animate-pulse">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100 dark:border-stone-800">
            <div className="h-16 w-16 rounded-3xl bg-stone-200 dark:bg-stone-700" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-stone-200 dark:bg-stone-700 rounded" />
              <div className="h-4 w-48 bg-stone-200 dark:bg-stone-700 rounded" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
            <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
            <div className="h-24 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="mb-10 font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
        User <span className="text-pizza-500">Profile</span>
      </h2>

      <div className="island-card">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="h-16 w-16 rounded-3xl bg-pizza-500 flex items-center justify-center shadow-lg shadow-pizza-500/20">
            <UserIcon className="h-8 w-8 text-stone-900" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{username}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-2">Display Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                placeholder="How should we call you?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-2">Phone Number</label>
            <div className="relative group">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                placeholder="+234..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 ml-2">Default Address</label>
            <div className="relative group">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner focus:outline-none focus:ring-4 focus:ring-pizza-500/10 focus:border-pizza-500 transition-all"
                placeholder="Your delivery address..."
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          
          <div className="pt-2">
            <Button type="primary" disabled={isLoading}>
              <div className="flex items-center justify-center gap-2">
                {isLoading ? 'Saving...' : (
                  <>
                    {isSuccess ? <CheckBadgeIcon className="h-5 w-5" /> : null}
                    <span>{isSuccess ? 'Profile Saved!' : 'Update Profile'}</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
