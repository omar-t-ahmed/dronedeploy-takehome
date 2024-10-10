import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-blue-500 text-white p-4 w-full">
      <i className="fa-solid fa-rocket"></i>
      <span className="ml-auto font-bold">Drone Data Analyzer</span>
    </nav>
  )
}

export default Navbar