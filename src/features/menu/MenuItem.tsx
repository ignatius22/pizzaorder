import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { addItem, getCurrentQuantityById } from '../cart/cartSlice';
import DeleteItem from '../cart/DeleteItem';
import UpdateItem from '../cart/UpdateItem';
import { Pizza } from '../../types';
import { AppDispatch } from '../../store';

interface MenuItemProps {
  pizza: Pizza;
}

function MenuItem({ pizza }: MenuItemProps) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  
  const isInCart = currentQuantity > 0;

  const dispatch = useDispatch<AppDispatch>();
  
  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }

  return (
    <div className="island-card flex flex-col overflow-hidden !p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="h-48 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={name}
          className={`h-full w-full object-cover transition-transform duration-500 hover:scale-110 ${
            soldOut ? 'opacity-70 grayscale' : ''
          }`}
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-stone-900 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white ring-1 ring-white/25">
              Sold Out
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{name}</h3>
          {!soldOut && (
            <span className="text-lg font-black text-pizza-600">
              {formatCurrency(unitPrice)}
            </span>
          )}
        </div>
        
        <p className="mb-6 flex-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400 line-clamp-2 italic">
          {ingredients.join(', ')}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          {isInCart ? (
            <div className="flex w-full items-center justify-between">
              <UpdateItem pizzaId={id} currentQuantity={currentQuantity} />
              <DeleteItem pizzaId={id} />
            </div>
          ) : !soldOut ? (
            <Button type="primary" onClick={handleAddToCart}>
              Add to cart
            </Button>
          ) : (
             <p className="text-sm font-bold uppercase text-stone-400">Not Available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
