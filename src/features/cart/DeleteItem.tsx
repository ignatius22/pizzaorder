import React from 'react';
import Button from '../../ui/Button';
import { useDispatch } from 'react-redux';
import { deleteItem } from './cartSlice';
import { AppDispatch } from '../../store';

interface DeleteItemProps {
  pizzaId: number;
}

function DeleteItem({ pizzaId }: DeleteItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
      Delete
    </Button>
  );
}

export default DeleteItem;
