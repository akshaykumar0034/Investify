//src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/authService'; // <-- Import login

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Call the login API
      const response = await login(email, password);
      
      // 2. Get the token from the response
      const { accessToken } = response.data;
      
      // 3. Store the token in localStorage
      localStorage.setItem('accessToken', accessToken);

      // 4. Redirect to a new dashboard page
      navigate('/dashboard');

    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center py-24 bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-400">
          Sign in to Investify
        </h2>

        {error && (
          <div className="p-3 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email} // <-- Add value
              onChange={(e) => setEmail(e.target.value)} // <-- Add onChange
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password} // <-- Add value
              onChange={(e) => setPassword(e.target.value)} // <-- Add onChange
              className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold text-gray-900 bg-green-400 rounded-md hover:bg-green-300"
          >
            Sign in
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-green-400 hover:text-green-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;