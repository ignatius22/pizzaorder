import { motion } from 'framer-motion';
import { useFetcher, useLoaderData, Params } from 'react-router-dom';
import { getOrder } from '../../services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';
import OrderItem from './OrderItem';
import { useEffect } from 'react';
import UpdateOrder from './UpdateOrder';
import { Order as OrderType, Pizza } from '../../types';

import { useRealtimeOrder } from '../../hooks/useRealtimeOrder';

function Order() {
  const initialOrder = useLoaderData() as OrderType;
  const order = useRealtimeOrder(initialOrder);
  
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
    paymentStatus,
    email,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery || '');

  const fetcher = useFetcher<Pizza[]>();

  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
    },
    [fetcher],
  );

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status || 'preparing'} order
          </span>
          {paymentStatus === 'paid' && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-blue-50">
              Paid
            </span>
          )}
        </div>
      </div>

      <div className="island-card space-y-4">
        {/* Progress Bar */}
        <div className="relative pt-6 pb-2">
          <div className="flex mb-2 items-center justify-between text-xs font-bold uppercase tracking-widest text-stone-400 px-1">
            <span className={status === 'preparing' ? 'text-pizza-500' : ''}>Preparing</span>
            <span className={status === 'cooking' ? 'text-pizza-500' : ''}>Cooking</span>
            <span className={status === 'out-for-delivery' ? 'text-pizza-500' : ''}>En Route</span>
            <span className={status === 'delivered' ? 'text-pizza-500' : ''}>Delivered</span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-stone-100 dark:bg-stone-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: 
                  status === 'preparing' ? '25%' : 
                  status === 'cooking' ? '50%' : 
                  status === 'out-for-delivery' ? '75%' : 
                  status === 'delivered' ? '100%' : '10%' 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pizza-500 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
          <p className="font-medium">
            {deliveryIn >= 0
              ? `Only ${calcMinutesLeft(estimatedDelivery || '')} minutes left 😃`
              : 'Order should have arrived'}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            (Estimated delivery: {formatDate(estimatedDelivery || '')})
          </p>
        </div>
        {email && (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Confirmation sent to: <span className="font-bold">{email}</span>
          </p>
        )}
      </div>

      <ul className="divide-y divide-stone-200 dark:divide-stone-800 border-b border-t dark:border-stone-800">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher?.data?.find((dt) => dt.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 island-card">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
          Price pizza: {formatCurrency(orderPrice || 0)}
        </p>
        {priority && <p className="text-sm font-medium text-stone-600 dark:text-stone-400">Price priority: {formatCurrency(priorityPrice || 0)}</p>}
        <p className="font-bold text-lg pt-2 border-t border-stone-100 dark:border-stone-800">
          {paymentStatus === 'paid' ? 'Total Paid: ' : 'To pay on delivery: '} 
          {formatCurrency((orderPrice || 0) + (priorityPrice || 0))}
        </p>
      </div>
      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

export async function loader({ params }: { params: Params }): Promise<OrderType> {
  const order = await getOrder(params.orderId as string);
  return order;
}

export default Order;
