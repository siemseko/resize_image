// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const VALID_USERS = [
//   'admin_ai@gmail.com',
//   'user1@gmail.com',
//   'user2@gmail.com',
// ];

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const auth = localStorage.getItem('auth');

//     try {
//       const parsed = auth ? JSON.parse(auth) : null;

//       if (!parsed || !VALID_USERS.includes(parsed.email)) {
//         localStorage.removeItem('auth');
//         router.push('/login');
//       } else {
//         setLoading(false);
//       }
//     } catch {
//       localStorage.removeItem('auth');
//       router.push('/login');
//     }
//   }, [router]);

//   if (loading) return <div className="p-6 text-center">Checking authentications...</div>;

//   return <div
//     style={{
//       backgroundColor: '#ffffff',
//       backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%23fcf4e4' fill-opacity='1'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       backgroundRepeat: 'repeat',
//       backgroundSize: 'auto',
//       // padding: '40px',
//       textAlign: 'center',
//       color: '#333',
//       height: '100vh',
//     }}
//   >{children}</div>;
// }

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { Home, ImageIcon, LogOut, MicIcon, StickyNoteIcon } from 'lucide-react';
const VALID_USERS = [
  'admin_ai@gmail.com',
  'user1@gmail.com',
  'user2@gmail.com',
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('auth');

    try {
      const parsed = auth ? JSON.parse(auth) : null;

      if (!parsed || !VALID_USERS.includes(parsed.email)) {
        localStorage.removeItem('auth');
        router.push('/login');
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem('auth');
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={clsx(
          "fixed z-30 md:static h-screen bg-[#000] text-[#dfe0df] w-64 p-4 space-y-4 transition-transform transform md:translate-x-0 border-r border-r-[#1b1b1b]",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>X</button>
        </div>
        <nav>
          <Link href="/dashboard" className="bg-[#1c1c1e] mb-4 flex items-center gap-5 p-2 rounded-[8px] ">
            <div className="bg-[#1c1c1c] w-[50px] h-[50px] rounded-full border-2 border-[#000] text-[#ffffff] text-[22px]  flex items-center justify-center">
              S
            </div>
            <div>
              <div className='text-[#e0e4ea]'>SIEM Seko</div>
              <div className='text-[#545454]'>Super Admin</div>
            </div>
          </Link>


          <div className="bg-[#1c1c1e] w-full rounded-[8px]">
            <div className="relative">
              <Link
                href="/dashboard"
                className={`block px-4 py-2 ${pathname === '/dashboard' ? ' bg-[#3a3a3c] rounded-t-[8px]' : ''}`}
              >
                <div className='flex items-center gap-5'>

                  <div className='bg-[#ff9f0a] p-2 rounded-[8px]'><Home size={18} color='white' /> </div>
                  Home</div>
              </Link>
              <div className="absolute right-0 top-0 h-full w-[70%] border-b border-[#333] pointer-events-none" />
            </div>

            <div className="relative">
              <Link
                href="/dashboard/ImageToText"
                className={`block px-4 py-2 ${pathname === '/dashboard/ImageToText' ? 'bg-[#3a3a3c]' : ''}`}
              >
                <div className='flex items-center gap-5'>
                  <div className='bg-[#2fd159] p-2 rounded-[8px]'><ImageIcon size={18} color='white' /> </div>
                  ImageToText
                </div>
              </Link>
              <div className="absolute right-0 top-0 h-full w-[70%] border-b border-[#333] pointer-events-none" />
            </div>

            <div className="relative">
              <Link
                href="/dashboard/TextToVoice"
                className={`block px-4 py-2  ${pathname === '/dashboard/TextToVoice' ? '  bg-[#3a3a3c]' : ''}`}
              >
                <div className='flex items-center gap-5'>
                  <div className='bg-[#1584f4] p-2 rounded-[8px]'><MicIcon size={18} color='white' /> </div>
                  TextToVoice
                </div>
              </Link>
              <div className="absolute right-0 top-0 h-full w-[70%] border-b border-[#333] pointer-events-none" />
            </div>


            <div className="relative">
              <Link
                href="/dashboard/Note"
                className={`block px-4 py-2  ${pathname === '/dashboard/Note' ? 'bg-[#3a3a3c] rounded-b-[8px]' : ''}`}
              >
                <div className='flex items-center gap-5'>
                  <div className='bg-[#908f94] p-2 rounded-[8px]'><StickyNoteIcon size={18} color='white' /> </div>
                  Note
                </div>
              </Link>
            </div>
          </div>

        </nav>

        <div className="relative">
          <button
            onClick={() => {
              localStorage.removeItem('auth');
              location.href = '/resize_image/login';
            }}
            className={`block px-4 py-2 w-full cursor-pointer  bg-[#ff000033] rounded-[8px]`}
          >
            <div className='flex items-center gap-5'>
              <div className=' p-2 '><LogOut size={18} color='white' /> </div>
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top nav */}
        <div className="md:hidden bg-[#1c1c1c] p-2 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Dashboard</h1>
        </div>

        {/* Page content */}
        <main className=" bg-[#000] overflow-auto flex-1 black-scrollbar">{children}</main>
      </div>
    </div>
  )
}
