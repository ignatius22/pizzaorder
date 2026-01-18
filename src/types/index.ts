import { z } from 'zod';

export const PizzaSchema = z.object({
  id: z.number(),
  name: z.string(),
  unitPrice: z.number(),
  ingredients: z.array(z.string()),
  soldOut: z.boolean(),
  imageUrl: z.string(),
});

export type Pizza = z.infer<typeof PizzaSchema>;

export const CartItemSchema = z.object({
  pizzaId: z.number(),
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const OrderItemSchema = z.object({
  pizzaId: z.number(),
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  addIngredients: z.array(z.string()).optional(),
  removeIngredients: z.array(z.string()).optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  user_id: z.string().optional().nullable(),
  customer: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  priority: z.boolean().optional().nullable(),
  estimatedDelivery: z.string().optional().nullable(),
  cart: z.array(z.any()), // Use any for cart for now to be safe
  orderPrice: z.number().optional().nullable(),
  priorityPrice: z.number().optional().nullable(),
  status: z.string().optional().nullable(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional().nullable(),
  created_at: z.string().optional().nullable(),
});

export type Order = z.infer<typeof OrderSchema>;

export const NewOrderSchema = z.object({
  user_id: z.string().optional().nullable(),
  customer: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  priority: z.boolean(),
  cart: z.array(OrderItemSchema),
  orderPrice: z.number().optional(),
  priorityPrice: z.number().optional(),
});

export type NewOrder = z.infer<typeof NewOrderSchema>;

export interface CartState {
  cart: CartItem[];
}

export interface UserState {
  id?: string;
  email?: string;
  username: string;
  role: 'customer' | 'admin';
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'error';
  position: {
    latitude?: number;
    longitude?: number;
  };
  address: string;
  error: string;
}

export interface GeocodingResponse {
  locality: string;
  city: string;
  postcode: string;
  countryName: string;
}
