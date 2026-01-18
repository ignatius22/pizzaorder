import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './ui/Home';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder from './features/order/CreateOrder';
import Order, { loader as orderLoader } from './features/order/Order';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error';
import UpdateOrder, {
  action as updateOrderAction,
} from './features/order/UpdateOrder';
// import React from 'react'

import Login from './features/user/Login';
import ForgotPassword from './features/user/ForgotPassword';
import ResetPassword from './features/user/ResetPassword';
import ProtectedRoute from './ui/ProtectedRoute';
import AuthProvider from './ui/AuthProvider';
import OrderHistory from './features/order/OrderHistory';
import Profile from './features/user/Profile';
import Kitchen from './features/admin/Kitchen';
import AdminRoute from './ui/AdminRoute';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/menu',
            element: <Menu />,
            loader: menuLoader,
            errorElement: <Error />,
          },
          {
            path: '/cart',
            element: <Cart />,
          },
          {
            path: '/orders',
            element: <OrderHistory />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
          {
            path: '/order/new',
            element: <CreateOrder />,
          },
          {
            path: '/order/:orderId',
            element: <Order />,
            loader: orderLoader,
            errorElement: <Error />,
            action: updateOrderAction,
          },
          // Admin Routes
          {
            element: <AdminRoute />,
            children: [
              {
                path: '/admin/kitchen',
                element: <Kitchen />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
import { DarkModeProvider } from './ui/DarkModeContext';
import { ToastProvider } from './ui/ToastContext';

function App() {
  return (
    <DarkModeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </DarkModeProvider>
  );
}

export default App;
