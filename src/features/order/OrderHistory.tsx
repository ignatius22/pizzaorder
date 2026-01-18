import { useState, useEffect } from 'react';
import { getOrders } from '../../services/apiRestaurant';
import { Order as OrderType } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';

function OrderHistory() {
  const { id: userId } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setIsLoading(true);
        console.log('Fetching orders for userId:', userId);
        const data = await getOrders(userId!);
        console.log('Orders found:', data.length);
        setOrders(data);
      } catch (err: any) {
        console.error('Fetch orders error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (isLoading) return <Loader />;

  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  if (!orders.length) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="island-card max-w-lg mx-auto py-12">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">No orders yet!</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8">Your order history is empty. Start your first order now!</p>
          {userId && <p className="text-xs text-stone-300 dark:text-stone-600 mt-4 mb-4">Debug: Authenticated as {userId}</p>}
          <Button to="/menu" type="primary">View Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
          Order <span className="text-pizza-500">History</span>
        </h2>
        <p className="text-xs text-stone-400 dark:text-stone-500">Total: {orders.length} orders</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="island-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Order ID</p>
                <p className="font-mono text-sm text-stone-600 dark:text-stone-400">#{order.id.slice(0, 8)}...</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Placed On</p>
                <p className="text-sm text-stone-600 dark:text-stone-400">{formatDate(order.created_at || '')}</p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-pizza-100 dark:bg-pizza-900/20 text-pizza-700 dark:text-pizza-400 transition-colors">
                {order.status || 'preparing'}
              </div>
            </div>

            <ul className="divide-y divide-stone-100 dark:divide-stone-800 mb-4 transition-colors">
              {(order.cart as any[]).map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between text-sm">
                  <p>
                    <span className="font-bold">{item.quantity}&times;</span> {item.name}
                  </p>
                  <p className="font-medium">{formatCurrency(item.totalPrice || 0)}</p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800 transition-colors">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                Total: {formatCurrency((order.orderPrice || 0) + (order.priorityPrice || 0))}
              </p>
              <Button to={`/order/${order.id}`} type="small">
                Track Order
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
