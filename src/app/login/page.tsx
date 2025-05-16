'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Use EyeSlashIcon instead of EyeOffIcon
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
const USERS = [
  { email: 'admin_ai@gmail.com', password: '@seko_ai' },
  { email: 'user1@gmail.com', password: 'password1' },
  { email: 'user2@gmail.com', password: 'password2' },
  // Add more users here
];
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const userFound = USERS.find(
        (user) => user.email === email && user.password === password
      );

      if (userFound) {
        localStorage.setItem('auth', JSON.stringify({ email: userFound.email }));
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] font-kantumruy px-1">

      <div className="max-w-sm w-full p-6 bg-[#1c1c1e] rounded-[8px]">
        <div className="flex flex-col items-center mb-4">
          <UserIcon className="h-10 w-10 text-[#ffffff]" />
          <h1 className="text-xl text-[#ffffff] font-bold mt-2">ចូលប្រើប្រព័ន្ធ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-[#1c1c1e] px-1 text-xs text-[#ffffff] flex items-center gap-1 font-kantumruy">
              លេខសម្គាល់ អ៊ីមែល
              <span className="text-red-500">*</span>
              <span className="text-[#ffffff] cursor-pointer text-xs">ⓘ</span>
            </label>
            <div className="flex items-center border border-[#ffffff]  rounded-[8px] px-3 py-3 ">
              <UserIcon className="h-5 w-5 text-[#ffffff] mr-2" />
              <input
                type="text"
                placeholder="លេខសម្គាល់ អ៊ីមែល"
                className="w-full  outline-none bg-transparent font-kantumruy placeholder:text-[#ffffff] text-[#ffffff] "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-[#1c1c1e] px-1 text-xs text-[#ffffff] flex items-center gap-1 font-kantumruy">
              ពាក្យសម្ងាត់
              <span className="text-red-500">*</span>
              <span className="text-[#ffffff] cursor-pointer text-xs">ⓘ</span>
            </label>
            <div className="flex items-center  rounded-[8px] border border-[#ffffff] px-3 py-3 ">
              <LockClosedIcon className="h-5 w-5 text-[#ffffff] mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="ពាក្យសម្ងាត់"
                className="w-full outline-none bg-transparent font-kantumruy placeholder:text-[#ffffff] text-[#ffffff]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-[#ffffff] flex items-center gap-2 cursor-pointer font-kantumruy">
            <EyeIcon className="h-4 w-4" />
            <span>ភ្លេចពាក្យសម្ងាត់?</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 font-bold font-kantumruy cursor-pointer text-white rounded relative overflow-hidden ${loading
              ? 'bg-[#1c1c1e]'
              : 'bg-[#1c1c1e9e]  hover:bg-[#1c1c1e9e] '
              }`}
            disabled={loading}
          >
            <span className="relative z-10">{loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}</span>
            {!loading && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/60 to-white/20 animate-shimmer" />
            )}
          </button>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Register */}
        <div className="text-center mt-6 text-[#ffffff] flex justify-center items-center gap-2 font-kantumruy">
          <UserIcon className="h-4 w-4" />
          <span>បង្កើតគណនីថ្មី</span>
        </div>
      </div>
    </div>

  );
}
