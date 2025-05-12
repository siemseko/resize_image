'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Use EyeSlashIcon instead of EyeOffIcon
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
const USER = {
  email: 'admin@gmail.com',
  password: '@123456',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate loading (can replace with actual async logic if needed)
    setTimeout(() => {
      // Check credentials
      if (email === USER.email && password === USER.password) {
        // Store a "logged in" status in localStorage
        localStorage.setItem('auth', JSON.stringify({ email }));
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000); // Simulated loading time
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6e6e6] font-kantumruy px-1">
      <div className="max-w-sm w-full p-6 bg-[#f2f5f9]">
        <div className="flex flex-col items-center mb-4">
          <UserIcon className="h-10 w-10 text-[#052878]" />
          <h1 className="text-xl text-[#052878] font-bold mt-2">ចូលប្រើប្រព័ន្ធ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-[#f2f5f9] px-1 text-xs text-gray-600 flex items-center gap-1 font-kantumruy">
              លេខសម្គាល់ អ៊ីមែល
              <span className="text-red-500">*</span>
              <span className="text-gray-400 cursor-pointer text-xs">ⓘ</span>
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-3 bg-white">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="លេខសម្គាល់ អ៊ីមែល"
                className="w-full outline-none bg-transparent font-kantumruy placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-[#f2f5f9] px-1 text-xs text-gray-600 flex items-center gap-1 font-kantumruy">
              ពាក្យសម្ងាត់
              <span className="text-red-500">*</span>
              <span className="text-gray-400 cursor-pointer text-xs">ⓘ</span>
            </label>
            <div className="flex items-center border border-gray-300 px-3 py-3 bg-white">
              <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="ពាក្យសម្ងាត់"
                className="w-full outline-none bg-transparent font-kantumruy placeholder:text-gray-400"
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
          <div className="text-sm text-[#052878] flex items-center gap-2 cursor-pointer font-kantumruy">
            <EyeIcon className="h-4 w-4" />
            <span>ភ្លេចពាក្យសម្ងាត់?</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 font-bold font-kantumruy cursor-pointer ${loading ? 'bg-[#0528789b]' : 'bg-[#052878] text-white'}`}
            disabled={loading}
          >
            {loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Register */}
        <div className="text-center mt-6 text-[#052878] flex justify-center items-center gap-2 font-kantumruy">
          <UserIcon className="h-4 w-4" />
          <span>បង្កើតគណនីថ្មី</span>
        </div>
      </div>
    </div>

  );
}
