import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Mock API call for frontend-only testing
      // In production, replace with actual API call
      const mockResponse = await new Promise<{ success: boolean; token: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            token: 'mock-jwt-token-' + Date.now()
          });
        }, 1000);
      });

      if (mockResponse.success === true) {
        // Extract JWT token and save to localStorage
        const token = mockResponse.token;
        localStorage.setItem('jwtToken', token);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-4 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
          <img 
            src="/assets/login-img.png" 
            alt="PrepRoute Illustration" 
            className="w-full max-w-[450px] h-auto object-contain"
          />
        </div>

        {/* Right Side: Login Form Card */}
        <div className="w-full md:w-[500px] bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-8 md:p-12">
          
          {/* Logo */}
          <div className="mb-10 text-left">
            <img 
              src="/assets/logo.png" 
              alt="PrepRoute" 
              className="h-8 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-[#1E293B] mb-2">Login</h1>
            <p className="text-sm text-[#64748B]">
              Use your company provided Login credentials.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-[#334155] mb-2">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6C9EFF] focus:bg-white transition-all text-sm"
                placeholder="Enter User ID"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#334155] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6C9EFF] focus:bg-white transition-all text-sm"
                placeholder="Enter Password"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <a 
                href="#forgot" 
                className="text-sm font-medium text-[#3B82F6] hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#6C9EFF] hover:bg-[#558BE6] text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C9EFF] mt-4"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;