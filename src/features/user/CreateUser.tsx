import React, { useState, FormEvent } from 'react';
import Button from '../../ui/Button';
import { useDispatch } from 'react-redux';
import { updateUserName } from './userSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppDispatch } from '../../store';

import { UserIcon } from '@heroicons/react/24/outline';

function CreateUser() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username) return;
    dispatch(updateUserName(username));
    navigate('/menu');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <p className="mb-6 text-stone-500">
        👋 Welcome! Please start by telling us your name:
      </p>

      <div className="relative mb-8 group">
        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
        <input
          type="text"
          placeholder="Your full name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-2xl bg-stone-50 border border-stone-100 py-3.5 pl-12 pr-4 text-stone-800 shadow-inner transition-all focus:bg-white focus:border-pizza-500 focus:ring-4 focus:ring-pizza-500/10 focus:outline-none"
        />
      </div>

      {username !== '' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button type="primary">Start ordering</Button>
        </motion.div>
      )}
    </form>
  );
}

export default CreateUser;
