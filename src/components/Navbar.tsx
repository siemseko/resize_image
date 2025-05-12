'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { name: 'ResizeImage', href: '/dashboard' },
  { name: 'ImageToText', href: '/dashboard/ImageToText' },
//   { name: 'Services', href: '/services' },
//   { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
   <nav className="flex bg-[#f2f5f9]">
      <div className="container items-center justify-center max-w-6xl mx-auto px-4 py-3 flex space-x-6 font-semibold">
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

           <button
        onClick={() => {
          localStorage.removeItem('auth');
          location.href = '/resize_image/login';
        }}
        className="mb-2 bg-red-600 text-white px-4 py-2 cursor-pointer"
      >
        Logout
      </button>
      </div>
    
    </nav>
  );
}
