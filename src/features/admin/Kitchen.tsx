import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { getAllOrders, updateOrderStatus } from '../../services/apiRestaurant';
import { Order as OrderType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import { 
  FireIcon, 
  TruckIcon, 
  HashtagIcon, 
  CheckCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

function Kitchen() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();

    // Set up Realtime for ALL orders
    const channel = supabase
      .channel('kitchen-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Kitchen update:', payload);
          if (payload.eventType === 'INSERT') {
            setOrders(current => [...current, payload.new as OrderType]);
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.status === 'delivered') {
              setOrders(current => current.filter(o => o.id !== payload.new.id));
            } else {
              setOrders(current => current.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleStatusUpdate(id: string, newStatus: string) {
    try {
      await updateOrderStatus(id, newStatus);
    } catch (err) {
      alert('Failed to update status');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
            Kitchen <span className="text-pizza-500">Dashboard</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400">Manage live orders and production flow.</p>
        </div>
        <div className="bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl px-6 py-3 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Active Orders</p>
          <p className="text-2xl font-black text-pizza-600">{orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="island-card flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <HashtagIcon className="h-4 w-4 text-stone-400" />
                <span className="font-mono text-sm font-bold text-stone-600 dark:text-stone-400">
                  {order.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${order.status === 'preparing' ? 'bg-orange-100 text-orange-700' : 
                  order.status === 'cooking' ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'}`}>
                {order.status}
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Customer</p>
                <p className="font-bold text-stone-800 dark:text-stone-100">{order.customer}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{order.address}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Items</p>
                <ul className="space-y-1">
                  {(order.cart as any[]).map((item, i) => (
                    <li key={i} className="text-sm flex justify-between">
                      <span className="text-stone-700 dark:text-stone-300"><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-3">
              {order.status === 'preparing' && (
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'cooking')}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-red-500/20 text-sm"
                >
                  <FireIcon className="h-4 w-4" /> Start Cooking
                </button>
              )}
              {order.status === 'cooking' && (
                <button 
                   onClick={() => handleStatusUpdate(order.id, 'out-for-delivery')}
                   className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
                >
                  <TruckIcon className="h-4 w-4" /> Out for Delivery
                </button>
              )}
              {(order.status === 'out-for-delivery' || order.status === 'preparing' || order.status === 'cooking') && (
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-green-500/20 text-sm col-span-1"
                >
                  <CheckCircleIcon className="h-4 w-4" /> Done
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <ShoppingBagIcon className="h-16 w-16 text-stone-200 mx-auto mb-4" />
            <p className="text-xl font-bold text-stone-400">No active orders. Kitchen is quiet! 😴</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kitchen;
