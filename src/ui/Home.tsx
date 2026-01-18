import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import CreateUser from '../features/user/CreateUser';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

function Home() {
  const { username, isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex items-center justify-center py-10 sm:py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="island-card max-w-2xl w-full text-center"
      >
        <h1 className="mb-10 text-2xl font-black md:text-5xl font-display leading-tight">
          The best pizza.
          <br />
          <span className="text-pizza-500 bg-pizza-50 px-4 py-1 rounded-2xl inline-block mt-2">
            Straight to you.
          </span>
        </h1>
        
        <p className="text-stone-500 mb-12 text-lg">
          Experience the authentic taste of hand-crafted pizzas delivered with precision and speed.
        </p>

        <div className="flex justify-center">
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-stone-600 font-medium">Welcome back, <span className="text-pizza-600 font-bold">{username}</span>!</p>
              <Button to="/menu" type="primary">
                Continue Ordering
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-stone-500">Ready for a slice of heaven?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button to="/login" type="primary">
                  Sign In to Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
