import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/navLinks';

function Navbar() {
  return (
    <nav 
      className="h-[72px] text-white select-none border-y border-neutral-900 shadow-md"
      style={{ background: 'linear-gradient(90deg, #1f1f1f, #292929)' }}
    >
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-center">
        <div className="flex items-center h-full">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `w-[110px] h-full flex items-center justify-center border-r border-[rgba(255,255,255,0.15)] text-base font-medium text-white select-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 relative ${
                  isActive ? 'border-b-[3px] border-b-white' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
