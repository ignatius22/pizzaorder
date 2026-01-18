import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../services/supabase';
import { logout } from '../features/user/userSlice';
import { RootState } from '../store';
import SearchOrder from '../features/order/SearchOrder';
import Username from '../features/user/Username';
import { ArrowLeftOnRectangleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from './DarkModeContext';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  async function handleLogout() {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate('/login');
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <SearchOrder />
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-stone-400 hover:text-pizza-500 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full transition-all"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>
        
        <Username />
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
