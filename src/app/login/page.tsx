'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Use EyeSlashIcon instead of EyeOffIcon

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full p-6 bg-[#f2f5f9]">
        <h1 className="text-2xl font-bold text-center mb-4 font-kantumruy">
          ចូលប្រើប្រព័ន្ធ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-2 border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5 cursor-pointer" />
              ) : (

                <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-2 cursor-pointer ${loading ? 'bg-[#f2f5f9]' : 'bg-[#052878] text-white'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>

  );
}
