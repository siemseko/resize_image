'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'ImageToText', href: '/ImageToText' },
//   { name: 'Services', href: '/services' },
//   { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex space-x-6 font-semibold">
        {navItems.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'relative pb-1',
              pathname === href
                ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600 after:rounded'
                : 'text-gray-700 hover:text-blue-600'
            )}
          >
            {name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
