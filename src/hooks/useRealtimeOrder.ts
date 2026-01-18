import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Order as OrderType } from '../types';

export function useRealtimeOrder(initialOrder: OrderType) {
  const [order, setOrder] = useState<OrderType>(initialOrder);

  useEffect(() => {
    // 1. Set up the subscription
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          console.log('Realtime order update:', payload);
          setOrder((current) => ({
            ...current,
            ...payload.new,
          }));
        }
      )
      .subscribe();

    // 2. Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  return order;
}
