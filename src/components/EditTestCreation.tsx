import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditTestCreation: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Chapter Wise');
  const [formData, setFormData] = useState({
    subject: '',
    testName: '',
    topic: '',
    subTopic: '',
    duration: '',
    difficulty: '',
    wrongAnswer: '',
    unattempted: '',
    correctAnswer: '',
    noOfQuestions: '',
    totalMarks: ''
  });

  const tabs = ['Chapter Wise', 'PYQ', 'Mock Test'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen text-[#1E293B] font-sans">
      
      {/* Top Header */}
      <div className="w-full h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-slate-400 hover:bg-slate-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-800">Edit Test Creation</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full"></span>
          </button>
          <div className="h-8 w-px bg-[#E2E8F0]" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-100 flex-shrink-0">
              <img 
                src="/assets/profile-img.png" 
                alt="Alex Wando Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#1E293B]">Alex Wando</p>
              <p className="text-xs font-medium text-[#94A3B8]">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-8">
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="">Select Subject</option>
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            {/* Name of Test */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Name of Test
              </label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleInputChange}
                placeholder="Enter test name"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Topic
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="">Select Topic</option>
                <option value="Grammar">Grammar</option>
                <option value="Writing">Writing</option>
                <option value="Reading">Reading</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            {/* Sub Topic */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Sub Topic
              </label>
              <select
                name="subTopic"
                value={formData.subTopic}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="">Select Sub Topic</option>
                <option value="Application">Application</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Enter duration"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
              />
            </div>

            {/* Test Difficulty Level */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Test Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

          </div>

          {/* Marking Scheme Section */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Marking Scheme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Wrong Answer */}
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Wrong Answer
                </label>
                <input
                  type="number"
                  name="wrongAnswer"
                  value={formData.wrongAnswer}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Unattempted */}
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Unattempted
                </label>
                <input
                  type="number"
                  name="unattempted"
                  value={formData.unattempted}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">
                  Correct Answer
                </label>
                <input
                  type="number"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
                />
              </div>

            </div>
          </div>

          {/* No. of Questions & Total Marks */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* No. of Questions */}
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                  No. of Questions
                </label>
                <input
                  type="number"
                  name="noOfQuestions"
                  value={formData.noOfQuestions}
                  onChange={handleInputChange}
                  placeholder="Enter number of questions"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  placeholder="Enter total marks"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder:text-[#94A3B8]"
                />
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => console.log('Save test creation')}
              className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditTestCreation;
