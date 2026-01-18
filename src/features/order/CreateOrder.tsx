import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon, 
  RocketLaunchIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { usePaystackPayment } from 'react-paystack';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import { RootState, AppDispatch } from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchAddress } from '../user/userSlice';
import { NewOrder } from '../../types';

const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cart = useSelector(getCart);
  
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const {
    id: userId,
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state: RootState) => state.user);
  
  const isLoadingAddress = addressStatus === 'loading';

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: totalPrice * 100 * 1500, // Assuming 1500 NGN per standard unit for demo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  if (!cart.length) return <EmptyCart />;

  const handleSuccess = async (reference: any) => {
    setIsPlacingOrder(true);
    const newOrder: any = {
      user_id: userId,
      customer: customer || username,
      email,
      phone,
      address,
      priority: withPriority,
      cart: cart.map(item => ({...item})),
      orderPrice: totalCartPrice,
      priorityPrice: priorityPrice,
    };

    try {
      const order = await createOrder(newOrder);
      dispatch(clearCart());
      navigate(`/order/${order.id}`);
    } catch (err) {
      setOrderError('Payment successful but order creation failed. Please contact support.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const onClose = () => {
    console.log('closed');
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError('');
    setOrderError('');

    if (!isValidPhone(phone)) {
      setPhoneError('Please provide a valid phone number.');
      return;
    }

    // @ts-ignore
    initializePayment(handleSuccess, onClose);
  }

  return (
    <div className="py-8">
      <h2 className="mb-10 font-display text-4xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
        Checkout <span className="text-pizza-500">Details</span>
      </h2>

      <div className="island-card">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">
                First Name
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
                <input
                  type="text"
                  name="customer"
                  required
                  className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner transition-all focus:bg-white dark:focus:bg-stone-800 focus:border-pizza-500 focus:ring-4 focus:ring-pizza-500/10 focus:outline-none"
                  defaultValue={username}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">
                Email Address
              </label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner transition-all focus:bg-white dark:focus:bg-stone-800 focus:border-pizza-500 focus:ring-4 focus:ring-pizza-500/10 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">
                Phone Number
              </label>
              <div className="relative group">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border py-3.5 pl-12 pr-4 text-stone-800 dark:text-stone-100 shadow-inner transition-all focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:outline-none ${
                    phoneError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-stone-100 dark:border-stone-800 focus:border-pizza-500 focus:ring-pizza-500/10'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="ml-4 mt-2 text-xs font-medium text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-2">
                Delivery Address
              </label>
              <div className="relative group">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 transition-colors group-focus-within:text-pizza-500" />
                <input
                  type="text"
                  name="address"
                  required
                  disabled={isLoadingAddress}
                  defaultValue={address}
                  className={`w-full rounded-2xl bg-stone-50 dark:bg-stone-900/50 border py-3.5 pl-12 pr-32 text-stone-800 dark:text-stone-100 shadow-inner transition-all focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:outline-none ${
                    addressStatus === 'error'
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                      : 'border-stone-100 dark:border-stone-800 focus:border-pizza-500 focus:ring-pizza-500/10'
                  }`}
                />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {!(position as any).latitude && !(position as any).longitude && (
                    <Button
                      type="small"
                      disabled={isLoadingAddress}
                      onClick={(e) => {
                        e.preventDefault();
                        // @ts-ignore
                        dispatch(fetchAddress());
                      }}
                    >
                      {isLoadingAddress ? 'Detecting...' : 'Get location'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Priority Checkbox */}
          <div className="flex items-center gap-4 rounded-2xl bg-pizza-50 dark:bg-pizza-900/10 border border-pizza-100 dark:border-pizza-900/20 p-6 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pizza-500 text-stone-900 shadow-inner">
               <RocketLaunchIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <label htmlFor="priority" className="block text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                Express Delivery (+20%)
              </label>
              <p className="text-xs text-pizza-700 dark:text-pizza-400">Get your order prioritised for faster delivery.</p>
            </div>
            <input
              className="h-6 w-6 accent-pizza-500 cursor-pointer focus:ring-pizza-500 focus:ring-offset-2"
              type="checkbox"
              name="priority"
              id="priority"
              checked={withPriority}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWithPriority(e.target.checked)}
            />
          </div>

          {orderError && (
            <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{orderError}</p>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <Button disabled={isPlacingOrder || isLoadingAddress} type="primary">
              {isPlacingOrder
                ? 'Placing order...'
                : `Pay ${formatCurrency(totalPrice)} & Complete Order`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
