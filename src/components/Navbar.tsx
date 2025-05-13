'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
const navItems = [
  { name: 'ResizeImage', href: '/dashboard' },
  { name: 'ImageToText', href: '/dashboard/ImageToText' },
  //   { name: 'Services', href: '/services' },
  //   { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-[#f2f5f9]">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 font-semibold relative z-50">
        <img src="/images/sekoAI_Logo.png" alt="Logo" width={70} />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'relative pb-1',
                pathname === href
                  ? 'text-[#052878] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#052878] after:rounded'
                  : 'text-[#64748B] hover:text-[#052878]'
              )}
            >
              {name}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('auth');
            location.href = '/resize_image/login';
          }}
          className="bg-red-600 text-white px-4 py-2 cursor-pointer hidden lg:flex"
        >
          Logout
        </button>
        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-[#052878] focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
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
          <span className="font-semibold text-[#052878]">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-[#052878]">
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
                  ? 'text-[#052878] font-medium'
                  : 'text-[#64748B] hover:text-[#052878]'
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
