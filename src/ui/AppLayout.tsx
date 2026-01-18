import React, { useState } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';
import Loader from './Loader';
import Sidebar from './Sidebar';
import { RootState } from '../store';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <div
      className="flex h-screen overflow-hidden font-sans"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)',
      }}
    >
      {isAuthenticated && (
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {isLoading && <Loader />}

        {/* Topbar / Header integration */}
        <header className="flex h-20 items-center justify-between px-6 lg:px-10">
          {isAuthenticated && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-900/5 dark:bg-stone-800 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6 text-stone-600 dark:text-stone-400" />
            </button>
          )}

          {isAuthenticated && (
            <div className="flex flex-1 items-center justify-end gap-6">
              <Header />
            </div>
          )}
        </header>

        {/* Main Content Island */}
        <main className="flex-1 overflow-y-auto px-4 pb-24 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
