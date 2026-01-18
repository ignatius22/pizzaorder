import { useFetcher, ActionFunctionArgs } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';
import { Order } from '../../types';

interface UpdateOrderProps {
  order: Order;
}

function UpdateOrder({ order }: UpdateOrderProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="mt-8">
      <Button type="primary">prioritise order</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }: ActionFunctionArgs) {
  const data = { priority: true };
  await updateOrder(params.orderId as string, data);
  return null;
}
