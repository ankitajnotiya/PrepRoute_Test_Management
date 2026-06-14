import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import TestCreation from './components/TestCreation';
import QuestionCreation from './components/QuestionCreation';
import Navigation from './components/Navigation';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/tests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId: string) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await fetch(`/tests/${testId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="w-full bg-white min-h-screen text-[#1E293B] font-sans relative">
          <div className="max-w-[1400px] ml-[250px] pt-8 px-12">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="w-full bg-white min-h-screen text-[#1E293B] font-sans relative">
        <div className="max-w-[1400px] ml-[250px] pt-8 px-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1E293B]">Dashboard</h1>
            <button
              onClick={() => navigate('/test-creation')}
              className="px-6 py-2.5 bg-[#6C9EFF] hover:bg-[#558BE6] text-white rounded-xl font-medium transition-colors"
            >
              Create New Test
            </button>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#334155]">Test Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#334155]">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#334155]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#334155]">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#334155]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 text-sm text-[#1E293B]">{test.name}</td>
                    <td className="px-6 py-4 text-sm text-[#1E293B]">{test.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        test.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1E293B]">{new Date(test.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/question-creation?testId=${test.id}`)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/test-creation?testId=${test.id}`)}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-creation" element = {
          <>
            <Navigation />
            <TestCreation />
          </>
        } />
        
        {/* FIX: Is route se Navigation hataya taaki QuestionCreation ka apna internal layout proper chale */}
        <Route path="/question-creation" element={<QuestionCreation />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;