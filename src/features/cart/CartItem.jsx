
import { formatCurrency } from "../../utils/helpers";

function CartItem({ item }) {
  /* eslint-disable no-unused-vars */
  // eslint-disable-next-line react/prop-types
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li>
      <p>
        {quantity}&times; {name}
      </p>
      <div>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default CartItem;
