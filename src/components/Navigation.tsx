import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Image ke side menu ke mutabik navigation paths
  const navItems = [

    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      path: '/test-creation',
      label: 'Test Creation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      )
    },
    {
      path: '/test-tracking',
      label: 'Test Tracking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a4.5 4.5 0 111.507-3.141m1.507 3.141a4.5 4.5 0 11-1.507-3.141M7.5 21h6" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* 1. Left Sidebar Panels */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#E2E8F0] flex flex-col z-30">
        {/* Brand Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#F1F5F9]">
          <img 
            src="/logo.png" 
            alt="PrepRoute" 
            className="h-7 object-contain"
          />
        </div>

        {/* Navigation Item Lists */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path) && item.path !== '/test-creation';
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl relative transition-all ${
                  active 
                    ? 'text-[#4F46E5] bg-[#EEF2FF]' 
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                {/* Active left indicator tag line */}
                {active && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#4F46E5] rounded-r-md" />
                )}
                <span className={`${active ? 'text-[#4F46E5]' : 'text-[#94A3B8]'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Top Header Bar */}
      <header className="fixed top-0 right-0 left-64 h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-end px-8 z-20">
        <div className="flex items-center gap-6">
          
          {/* Notification Alert Bell icon */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {/* Green Notification Dot Indicator */}
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full"></span>
          </button>

          {/* Vertical Separator */}
          <div className="h-8 w-px bg-[#E2E8F0]" />

          {/* Profile User Dropdown Control Wrapper */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              {/* User Avatar Custom Image Placeholder */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-100 flex-shrink-0">
                <img 
                  src="/profile-img.png" 
                  alt="Alex Wando Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Profile Meta Meta Text */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-[#1E293B]">Alex Wando</p>
                  <svg className="w-4 h-4 text-[#64748B] group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-[#94A3B8]">Admin</p>
              </div>
            </button>

            {/* Profile Menu Dropdown Overlay Panel */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 z-50">
                <button 
                  onClick={() => console.log('Navigate Profile')} 
                  className="w-full text-left px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC]"
                >
                  My Profile
                </button>
                <div className="h-px bg-[#E2E8F0] my-1" />
                <button 
                  onClick={() => console.log('Logout Logic')} 
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
};

export default Navigation;