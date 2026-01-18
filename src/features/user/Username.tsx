import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserIcon } from '@heroicons/react/24/outline';

function Username() {
  const { username, isAuthenticated } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) return null;

  return (
    <div className="hidden md:flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
      <div className="h-6 w-6 rounded-full bg-pizza-500 flex items-center justify-center">
        <UserIcon className="h-3.5 w-3.5 text-stone-900" />
      </div>
      <span className="text-sm font-bold text-stone-700">{username}</span>
    </div>
  );
}

export default Username;
