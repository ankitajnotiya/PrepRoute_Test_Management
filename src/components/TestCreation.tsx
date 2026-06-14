import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TestCreationProps {
  showPublishButton?: boolean; 
}

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
}

interface SubTopic {
  id: string;
  name: string;
}

const TestCreation: React.FC<TestCreationProps> = ({ showPublishButton = false }) => {
  const navigate = useNavigate();
  
  // Tabs and Fields State Variables
  const [testType, setTestType] = useState('Chapter Wise');
  const [subject, setSubject] = useState('');
  const [testName, setTestName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  // Marking Scheme counters
  const [wrongAnswer, setWrongAnswer] = useState(-1);
  const [unattempted, setUnattempted] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(5);
  
  const [noOfQuestions, setNoOfQuestions] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  // API Data States
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  // Validation Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Fetch subjects on page load
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Mock data for frontend-only
      setSubjects([
        { id: '1', name: 'Physics' },
        { id: '2', name: 'Chemistry' },
        { id: '3', name: 'Mathematics' }
      ]);
    }
  };

  // Fetch topics when subject is selected
  useEffect(() => {
    if (subject) {
      fetchTopics(subject);
    }
  }, [subject]);

  const fetchTopics = async (subjectId: string) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`/topics/subject/${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Mock data for frontend-only
      setTopics([
        { id: '1', name: 'Mechanics' },
        { id: '2', name: 'Thermodynamics' },
        { id: '3', name: 'Waves' }
      ]);
    }
  };

  // Fetch sub-topics when topics are selected
  useEffect(() => {
    if (selectedTopics.length > 0) {
      fetchSubTopics(selectedTopics);
    }
  }, [selectedTopics]);

  const fetchSubTopics = async (topicIds: string[]) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/sub-topics/multi-topics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topicIds })
      });
      const data = await response.json();
      setSubTopics(data);
    } catch (error) {
      console.error('Error fetching sub-topics:', error);
      // Mock data for frontend-only
      setSubTopics([
        { id: '1', name: 'Kinematics' },
        { id: '2', name: 'Dynamics' },
        { id: '3', name: 'Work Energy' }
      ]);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubTopicToggle = (subTopicId: string) => {
    setSelectedSubTopics(prev => 
      prev.includes(subTopicId) 
        ? prev.filter(id => id !== subTopicId)
        : [...prev, subTopicId]
    );
  };

  // Counters Handlers
  const handleIncrement = (type: string) => {
    if (type === 'wrong') setWrongAnswer(prev => prev + 1);
    if (type === 'unattempted') setUnattempted(prev => prev + 1);
    if (type === 'correct') setCorrectAnswer(prev => prev + 1);
  };

  const handleDecrement = (type: string) => {
    if (type === 'wrong') setWrongAnswer(prev => prev - 1);
    if (type === 'unattempted') setUnattempted(prev => prev - 1);
    if (type === 'correct') setCorrectAnswer(prev => prev - 1);
  };

  // Form Submit & Validation Layer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!subject) newErrors.subject = 'Subject selection is required';
    if (!testName.trim()) newErrors.testName = 'Test name cannot be empty';
    if (!duration.trim() || isNaN(Number(duration))) newErrors.duration = 'Please enter valid time (minutes)';
    if (!noOfQuestions.trim()) newErrors.noOfQuestions = 'Number of Questions is required';
    if (!totalMarks.trim()) newErrors.totalMarks = 'Total Marks is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setLoading(true);

      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('/tests', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: testName,
            subject,
            topics: selectedTopics,
            subTopics: selectedSubTopics,
            duration: Number(duration),
            difficulty,
            markingScheme: {
              correct: correctAnswer,
              wrong: wrongAnswer,
              unattempted
            },
            noOfQuestions: Number(noOfQuestions),
            totalMarks: Number(totalMarks),
            testType
          })
        });

        const data = await response.json();
        
        // Save test-uuid for next page
        localStorage.setItem('testUuid', data.testUuid || data.id);
        
        navigate('/question-creation');
      } catch (error) {
        console.error('Error creating test:', error);
        // Mock for frontend-only
        const mockUuid = 'test-' + Date.now();
        localStorage.setItem('testUuid', mockUuid);
        navigate('/question-creation');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-white min-h-screen text-[#1E293B] font-sans relative">
      
      {/* ----------------- TOP NAVBAR HEADER FIXED ----------------- */}
      <div className="fixed top-0 left-[250px] right-0 h-[75px] bg-white border-b border-[#E2E8F0] flex items-center justify-end px-12 z-50">
        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* User Profile Avatar Meta */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
              alt="Alex Wando" 
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">Alex Wando</p>
              <p className="text-xs text-slate-400 font-medium">Admin</p>
            </div>
            <svg className="w-4 h-4 text-slate-400 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Condition Based Publish Button: Tabhi dikhega jab prop true hoga */}
          {showPublishButton && (
            <button 
              type="button" 
              className="ml-4 px-8 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="max-w-[1400px] ml-[250px] pt-8 px-12 space-y-6 mt-[75px]">
        
        {/* 1. Breadcrumb Bar Section */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Test Creation</span>
          <span className="text-slate-300">/</span>
          <span>Create Test</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-semibold">{testType}</span>
        </div>

        {/* 2. Top Navigation Sub-Tabs Wrapper */}
        <div className="inline-flex bg-white border border-[#E2E8F0] p-1.5 rounded-xl gap-2 mb-4 mt-4">
          {['Chapter Wise', 'PYQ', 'Mock Test'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTestType(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                testType === tab
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-slate-400 hover:text-slate-600 bg-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. Multi Column Main Form Area */}
        <form onSubmit={handleSubmit} className="space-y-6"> 
          
          {/* Row 1: Subject & Name of Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Subject</label>
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSelectedTopics([]);
                    setSelectedSubTopics([]);
                    if(errors.subject) setErrors(p => ({...p, subject: ''}));
                  }}
                  className={`w-full px-4 py-3 bg-white border ${errors.subject ? 'border-red-500 ring-2 ring-red-100' : 'border-[#E2E8F0]'} rounded-xl text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6C9EFF]/30 text-sm transition-all`}
                >
                  <option value="" className="text-slate-300">Choose from Drop-down</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              {errors.subject && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Name of Test</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => {
                  setTestName(e.target.value);
                  if(errors.testName) setErrors(p => ({...p, testName: ''}));
                }}
                placeholder="Enter name of Test"
                className={`w-full px-4 py-3 bg-white border ${errors.testName ? 'border-red-500 ring-2 ring-red-100' : 'border-[#E2E8F0]'} rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C9EFF]/30 text-sm transition-all`}
              />
              {errors.testName && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.testName}</p>}
            </div>
          </div>

          {/* Row 2: Topic & Sub Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Topics (Multi-select)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-[#E2E8F0] rounded-xl p-3 bg-white">
                {topics.length === 0 ? (
                  <p className="text-sm text-slate-400">Select a subject first</p>
                ) : (
                  topics.map((t) => (
                    <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(t.id)}
                        onChange={() => handleTopicToggle(t.id)}
                        className="w-4 h-4 text-[#4F46E5] border-slate-300 rounded focus:ring-[#4F46E5]"
                      />
                      <span className="text-sm text-slate-700">{t.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Sub Topics (Multi-select)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-[#E2E8F0] rounded-xl p-3 bg-white">
                {subTopics.length === 0 ? (
                  <p className="text-sm text-slate-400">Select topics first</p>
                ) : (
                  subTopics.map((st) => (
                    <label key={st.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubTopics.includes(st.id)}
                        onChange={() => handleSubTopicToggle(st.id)}
                        className="w-4 h-4 text-[#4F46E5] border-slate-300 rounded focus:ring-[#4F46E5]"
                      />
                      <span className="text-sm text-slate-700">{st.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Duration & Test Difficulty Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Duration (Minutes)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if(errors.duration) setErrors(p => ({...p, duration: ''}));
                }}
                placeholder="Enter the time"
                className={`w-full px-4 py-3 bg-white border ${errors.duration ? 'border-red-500 ring-2 ring-red-100' : 'border-[#E2E8F0]'} rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C9EFF]/30 text-sm transition-all`}
              />
              {errors.duration && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-4">Test Difficulty Level</label>
              <div className="flex items-center gap-10 h-11">
                {['Easy', 'Medium', 'Difficult'].map((level) => (
                  <label key={level} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-600 group">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className="w-4 h-4 text-[#4F46E5] border-slate-300 focus:ring-[#4F46E5] transition-transform group-hover:scale-110"
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Marking Scheme */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Marking Scheme:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="grid grid-cols-3 gap-4">
                {/* Wrong Answer */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Wrong Answer</label>
                  <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-4 py-2.5 bg-white hover:border-slate-300 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{wrongAnswer > 0 ? `+${wrongAnswer}` : wrongAnswer}</span>
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => handleIncrement('wrong')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDecrement('wrong')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Unattempted */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Unattempted</label>
                  <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-4 py-2.5 bg-white hover:border-slate-300 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{unattempted >= 0 ? `+${unattempted}` : unattempted}</span>
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => handleIncrement('unattempted')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDecrement('unattempted')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Correct Answer</label>
                  <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-4 py-2.5 bg-white hover:border-slate-300 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{correctAnswer >= 0 ? `+${correctAnswer}` : correctAnswer}</span>
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => handleIncrement('correct')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDecrement('correct')} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Meta Input Blocks */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">No of Questions</label>
                  <input
                    type="text"
                    value={noOfQuestions}
                    onChange={(e) => {
                      setNoOfQuestions(e.target.value);
                      if(errors.noOfQuestions) setErrors(p => ({...p, noOfQuestions: ''}));
                    }}
                    placeholder="Ex: 50"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.noOfQuestions ? 'border-red-500 ring-2 ring-red-100' : 'border-[#E2E8F0]'} rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C9EFF]/30 text-sm transition-all`}
                  />
                  {errors.noOfQuestions && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.noOfQuestions}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">Total Marks</label>
                  <input
                    type="text"
                    value={totalMarks}
                    onChange={(e) => {
                      setTotalMarks(e.target.value);
                      if(errors.totalMarks) setErrors(p => ({...p, totalMarks: ''}));
                    }}
                    placeholder="Ex: 250 Marks"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.totalMarks ? 'border-red-500 ring-2 ring-red-100' : 'border-[#E2E8F0]'} rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C9EFF]/30 text-sm transition-all`}
                  />
                  {errors.totalMarks && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.totalMarks}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* 4. Action CTA Buttons Row Panel */}
          <div className="flex justify-end gap-4 pt-10">
            <button
              type="button"
              className="px-10 py-3 bg-[#F8FAFC] text-[#4F46E5] text-sm font-semibold rounded-xl hover:bg-[#F1F5F9] active:bg-[#E2E8F0] active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-3 bg-[#6C9EFF] text-white text-sm font-semibold rounded-xl hover:bg-[#80ADFF] active:bg-[#558BE6] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Next'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TestCreation;