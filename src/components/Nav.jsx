import React from 'react';
import { Link } from 'react-router-dom'; // Correct import

function Nav() {
  return (
    <div className="flex flex-row bg-gray-600 justify-between text-white px-4 py-2">
      <Link to="/" className="hover:underline">logo</Link>
      <Link to="/map" className="hover:underline">map</Link>
     
    </div>
  );
}

export default Nav;
