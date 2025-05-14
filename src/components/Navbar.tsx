'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
const navItems = [
  { name: 'ResizeImage', href: '/dashboard', icon: 'https://siemseko.github.io/resize_image/icons/image-solid.svg' },
  { name: 'ImageToText', href: '/dashboard/ImageToText', icon: 'https://siemseko.github.io/resize_image/icons/envelope-open-text-solid.svg' }, 
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-[#efece6] sticky top-0 w-full mx-auto z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2  ">
        <div className='flex items-center gap-1'>
        <img src="https://siemseko.github.io/resize_image/images/sekoAI_Logo.png" alt="Logo" width={70} />
        {/* <img src="/images/sekoAI_Logo.png" alt="Logo" width={70} /> */}
        Version-V1.0.1
        </div>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map(({ name, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'relative pb-1 flex items-center gap-2', // Added flex and gap for icon and text
                pathname === href
                  ? 'text-[#df9c16] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#df9c16] after:rounded'
                  : 'text-[#64748B] hover:text-[#df9c16]'
              )}
            >
              {/* Icon */}
              <img src={icon} alt={`${name} icon`} className="h-5 w-5" /> {/* Set icon size */}

              {/* Text */}
              {name}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-5'> 
          <button
            onClick={() => {
              localStorage.removeItem('auth');
              location.href = '/resize_image/login';
            }}
            className="bg-[#fc4f4f] text-white px-4 py-2 cursor-pointer hidden lg:flex"
          >
            Logout
          </button>
        </div>
        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-[#df9c16] focus:outline-none"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2}
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-[#00000078] bg-opacity-40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-semibold text-[#df9c16]">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-[#df9c16]">
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                'pb-1',
                pathname === href
                  ? 'text-[#df9c16] font-medium'
                  : 'text-[#64748B] hover:text-[#df9c16]'
              )}
            >
              {name}
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem('auth');
              location.href = '/resize_image/login';
            }}
            className="bg-red-600 text-white px-4 py-2 mt-4"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
