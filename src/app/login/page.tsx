'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const USERS = [
  { email: 'admin_ai@gmail.com', password: '@seko_ai' },
  { email: 'user1@gmail.com', password: 'password1' },
  { email: 'user2@gmail.com', password: 'password2' },
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
        router.push('/system');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 kantumruyPro">
      {/* Left Side - Login Form (30% width on desktop) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full p-8 rounded-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-green-100 rounded-full mb-3">
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl text-gray-800 ">ចូលប្រើប្រព័ន្ធ</h1>
            <p className="text-gray-500 mt-1">សូមបំពេញព័ត៌មានចូលប្រើប្រាស់</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                លេខសម្គាល់ អ៊ីមែល <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 focus-within:border-green-500 transition-colors">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="អ៊ីមែលរបស់អ្នក"
                  className="w-full outline-none bg-transparent placeholder:text-gray-400 text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                ពាក្យសម្ងាត់ <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 focus-within:border-green-500 transition-colors">
                <LockClosedIcon className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="ពាក្យសម្ងាត់របស់អ្នក"
                  className="w-full outline-none bg-transparent placeholder:text-gray-400 text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-green-600"
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
            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                ភ្លេចពាក្យសម្ងាត់?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3  rounded-lg relative overflow-hidden ${
                loading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } transition-colors shadow-md`}
              disabled={loading}
            >
              <span className="relative z-10">
                {loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}
              </span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mt-4">
                {error}
              </div>
            )}
          </form>

          {/* Register */}
          <div className="text-center mt-8 text-gray-600">
            <p className="inline-flex items-center justify-center gap-2">
              <span>មិនទាន់មានគណនី?</span>
              <button className="text-green-600 hover:text-green-800 font-medium">
                ចុះឈ្មោះឥឡូវនេះ
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Cover Background (70% width on desktop) */}
      <div className="hidden lg:flex lg:w-[70%] bg-green-500 items-center justify-center p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-400 opacity-90"></div>
        <div className="relative z-10 max-w-2xl text-center text-white">
          <h2 className="text-4xl  mb-6">សូមស្វាគមន៍មកកាន់ប្រព័ន្ធយើងខ្ញុំ</h2>
          <p className="text-xl mb-8 leading-relaxed">
            ប្រព័ន្ធគ្រប់គ្រងព័ត៌មានសម្រាប់ក្រុមហ៊ុនអ្នក ដោយផ្តល់នូវបទពិសោធន៍ល្អបំផុត
          </p>
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
              <LockClosedIcon className="h-20 w-20 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}