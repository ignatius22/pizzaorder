import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { getTotalCartPrice, getTotalCartQuantity } from './cartSlice';
import { formatCurrency } from '../../utils/helpers';

function CartOverview() {
  const quantity = useSelector(getTotalCartQuantity);
  const totalPrice = useSelector(getTotalCartPrice);

  return (
    <AnimatePresence>
      {quantity > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 w-auto min-w-[280px]"
        >
          <div className="flex items-center justify-between gap-6 overflow-hidden rounded-3xl bg-stone-900 px-6 py-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pizza-500 text-stone-900 shadow-inner">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  Quick Cart
                </p>
                <p className="space-x-2 text-sm font-semibold text-stone-100">
                  <span>{quantity} items</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-pizza-400">{formatCurrency(totalPrice)}</span>
                </p>
              </div>
            </div>

            <Link 
              to="/cart" 
              className="group flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition-all hover:bg-pizza-500 hover:text-stone-900"
            >
              <span className="sr-only">Open cart</span>
              <motion.span whileHover={{ x: 3 }}>&rarr;</motion.span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CartOverview;
