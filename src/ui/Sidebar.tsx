import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  Square3Stack3DIcon, 
  ShoppingCartIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);
  
  const links = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/menu', icon: Square3Stack3DIcon, label: 'Menu' },
    { to: '/cart', icon: ShoppingCartIcon, label: 'My Cart' },
    ...(isAuthenticated ? [
      { to: '/orders', icon: ClipboardDocumentListIcon, label: 'Order History' },
      { to: '/profile', icon: UserCircleIcon, label: 'My Profile' }
    ] : []),
    ...(role === 'admin' ? [
      { to: '/admin/kitchen', icon: BuildingStorefrontIcon, label: 'Kitchen Board' }
    ] : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Island */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white dark:bg-stone-900 shadow-2xl ring-1 ring-stone-900/5 lg:shadow-xl dark:ring-white/10 transition-colors duration-300">
          {/* Logo Area */}
          <div className="flex items-center justify-between px-6 pt-8 pb-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-pizza-600">
              PIZZA<span className="text-stone-800 dark:text-stone-200">CRAFT</span>
            </h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden text-stone-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <p className="px-6 mb-8 text-xs font-semibold uppercase tracking-widest text-stone-400">
            Main Menu
          </p>

          <nav className="flex-1 space-y-2 px-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose()}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <link.icon className="h-6 w-6" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-6 mt-auto">
            <div className="rounded-2xl bg-pizza-50 dark:bg-pizza-900/10 p-4 border border-pizza-100 dark:border-pizza-900/20">
              <p className="text-sm font-medium text-pizza-700 dark:text-pizza-400 mb-1">Weekly Special!</p>
              <p className="text-xs text-pizza-600 dark:text-pizza-500">Get 20% off on all Veggie Pizzas this weekend.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
