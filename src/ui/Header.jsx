import React from 'react';
import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/searchOrder';
import Username from '../features/user/Username';

function Header() {
  return (
    <header className="bg-yellow-500 uppercase px-4 py-3 border-b border-stone-200">
      <Link to="/" className="uppercase tracking-widest">
        Fast React Pizza Co
      </Link>
      <SearchOrder />
      <Username />
    </header>
  );
}

export default Header;
