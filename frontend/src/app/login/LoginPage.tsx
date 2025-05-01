"use client";

import React, { useState } from 'react';
import Button from '@/ui/components/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from "@/contexts/AuthContext"; 

const LoginPage = () => {
  const { setIsAuthenticated, setToken, setUser } = useAuth();

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
    setIsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful! Redirecting...");
        setIsError(false);
        // Store the token (example)
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true)
        setToken(data.token)
        setUser(data.user)

        setTimeout(() => {
          router.push('/'); // Redirect to the home page
        }, 2000);
      } else {
        const errorData = await response.json();
        let errorMessage = "Login failed";
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An unexpected error occurred. Please try again later.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleJobBoardClick = () => {
    router.push('/job-posts');
  };

  return (
    <div className="min-h-screen bg-[#212427] text-white flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
      {/* Left Section: Updated Text Content */}
      <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-white bg-clip-text">
          Welcome Back!
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl mb-6">
          Log in to access your account and manage your job postings.
        </p>
        <Button onClick={handleJobBoardClick} className='flex items-center'>
          <ArrowLeft className="mr-2 h-4 w-4" /> Job Openings
        </Button>
      </div>

      {/* Right Section: Login Form */}
      <div className="md:w-1/2 bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200">
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-1 block w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {message && (
            <p className={`text-sm italic ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
          )}

          <Button
            type="submit"
            className="w-full text-gray-900 hover:bg-lime-600 transition-colors duration-200 py-3 text-base rounded-md shadow-md"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;