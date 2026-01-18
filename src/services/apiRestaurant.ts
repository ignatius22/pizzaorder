import { z } from 'zod';
import { Pizza, PizzaSchema, Order, OrderSchema, NewOrder } from '../types';
import { supabase } from './supabase';

export async function getMenu(): Promise<Pizza[]> {
  const { data, error } = await supabase
    .from('pizzas')
    .select('*');

  if (error) throw Error('Failed getting menu');

  return z.array(PizzaSchema).parse(data);
}

export async function getOrder(id: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw Error(`Couldn't find order #${id}`);

  return OrderSchema.parse(data);
}

export async function createOrder(newOrder: NewOrder): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error || !data) throw Error(error?.message || 'Failed creating order');
    
    return OrderSchema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Validation failed:', err.issues);
      throw Error('API response validation failed');
    }
    throw Error(err instanceof Error ? err.message : 'Failed creating your order');
  }
}

export async function updateOrder(id: string, updateObj: Partial<Order>): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update(updateObj)
      .eq('id', id);

    if (error) throw Error(error.message);
  } catch (err) {
    throw Error('Failed updating your order');
  }
}
export async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw Error('Failed getting orders');

  console.log('Orders data from Supabase:', data);

  try {
    return z.array(OrderSchema).parse(data);
  } catch (err) {
    console.error('Zod parsing failed for orders:', err);
    // Return raw data as cast for debugging if parse fails
    return data as Order[]; 
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .neq('status', 'delivered')
    .order('created_at', { ascending: true });

  if (error) throw Error('Failed getting orders');

  return z.array(OrderSchema).parse(data);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw Error('Failed updating order status');
}

export async function updateProfile(id: string, updateObj: any): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updateObj)
    .eq('id', id);

  if (error) throw Error('Failed updating profile');
}
