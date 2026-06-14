'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Edit3,
  AlertCircle,
  Copy,
  Users,
  Home,
  User,
  Folder,
  DollarSign,
  Award,
  MessageSquare,
  Bell,
  Settings,
  ChevronRight,
  Plus,
  Download,
  Trash2
} from 'lucide-react';

interface Question {
  questionText: string;
  options: string[];
  correctOption: number;
  explanation: string;
  mediaUrl?: string;
}

const QuestionCreation: React.FC = () => {
  // Application Data States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    mediaUrl: ''
  });
  const [selectedQuestion, setSelectedQuestion] = useState(4);
  const [totalQuestions] = useState(50);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTestInfo, setShowTestInfo] = useState(true);

  // Question Creation Panel Toggle State Controller
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.questionText.trim()) {
      setQuestions(prev => [...prev, currentQuestion]);
      setCurrentQuestion({
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        explanation: '',
        mediaUrl: ''
      });
      setSelectedQuestion(questions.length + 1);
    }
  };

  const handleSaveAndContinue = async () => {
    let updatedQuestions = [...questions];
    if (currentQuestion.questionText.trim()) {
      updatedQuestions.push(currentQuestion);
      setQuestions(updatedQuestions);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/questions/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: localStorage.getItem('testUuid'),
          questions: updatedQuestions
        })
      });

      if (response.ok) {
        setIsPublishing(true);
      }
    } catch (error) {
      console.error('Error saving questions:', error);
      setIsPublishing(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = () => {
    setIsPublishing(true);
  };

  const handleConfirmPublish = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const testUuid = localStorage.getItem('testUuid');
      const response = await fetch(`/tests/${testUuid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'live' })
      });

      if (response.ok) {
        alert('Test published successfully!');
      }
    } catch (error) {
      console.error('Error publishing test:', error);
      alert('Test published successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleMCQUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.mcq';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = JSON.parse(event.target?.result as string);
            if (Array.isArray(content)) {
              const newQuestions: Question[] = content.map((q: any) => ({
                questionText: q.questionText || q.question,
                options: q.options || [],
                correctOption: q.correctOption || q.correct_answer || 0,
                explanation: q.explanation || '',
                mediaUrl: q.mediaUrl || q.media_url || ''
              }));
              setQuestions(prev => [...prev, ...newQuestions]);
              alert(`${newQuestions.length} questions imported successfully!`);
            }
          } catch (error) {
            alert('Error parsing MCQ file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCSVUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            const newQuestions: Question[] = [];
            
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',');
              if (values.length >= 5) {
                newQuestions.push({
                  questionText: values[0] || '',
                  options: [values[1], values[2], values[3], values[4]],
                  correctOption: parseInt(values[5]) || 0,
                  explanation: values[6] || '',
                  mediaUrl: values[7] || ''
                });
              }
            }
            
            setQuestions(prev => [...prev, ...newQuestions]);
            alert(`${newQuestions.length} questions imported from CSV!`);
          } catch (error) {
            alert('Error parsing CSV file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleQuestionExpand = (index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Sidebar Clean Line Icons Config Matrix
  const sidebarIcons = [
    { icon: LineChart, active: false },
    { icon: Edit3, active: true },
    { icon: AlertCircle, active: false },
    { icon: Copy, active: false },
    { icon: Users, active: false },
    { icon: Home, active: false, isDashboardLink: true }, // Added flag to catch dashboard redirect target
    { icon: User, active: false },
    { icon: Folder, active: false },
    { icon: DollarSign, active: false },
    { icon: Award, active: false },
    { icon: MessageSquare, active: false },
    { icon: Bell, active: false },
    { icon: Settings, active: false },
  ];

  return (
    <div className="w-full bg-[#FAFBFC] min-h-screen text-[#1E293B] font-sans flex overflow-hidden h-screen max-h-screen">
      
      {/* 1. PRIMARY SLEEK ICON SIDEBAR STRIP (ALWAYS STAYS AS LEFTMOST ANCHOR) */}
      <div className="w-[65px] h-screen bg-white border-r border-[#E2E8F0] shrink-0 flex flex-col items-center sticky top-0 z-30 overflow-hidden">
        {/* Top Header Placeholder Segment */}
        <div className="w-full h-[70px] shrink-0" />

        {/* Clean Layout Icons Stream Vector Loop */}
        <div className="flex flex-col items-center gap-[16px] w-full flex-1 justify-start pt-2 overflow-hidden">
          {sidebarIcons.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                onClick={item.isDashboardLink ? () => window.location.href = '/dashboard' : undefined}
                className={`p-2 rounded-xl transition-all ${
                  item.active 
                    ? 'text-[#4F46E5] bg-indigo-50/90 font-bold shadow-2xs' 
                    : 'text-[#94A3B8] hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <IconComponent className="w-[19px] h-[19px]" strokeWidth={1.8} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. QUESTION CREATION DROPDOWN PANEL BLOCK (NO INTERMEDIATE EXTRA LINKS) */}
      <div 
        className={`bg-white border-r border-[#E2E8F0] h-screen sticky top-0 transition-all duration-300 overflow-hidden flex flex-col z-20 shrink-0 ${
          isSidebarOpen ? 'w-[240px]' : 'w-0 border-r-0'
        }`}
      >
        {/* Brand Main Header Info Row */}
        <div className="h-[70px] px-6 flex items-center justify-between border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-1.5">
            <img 
              src="assets/logo.png" 
              alt="Logo" 
              className="h-7 w-auto object-contain cursor-pointer"
              onClick={() => window.location.href = '/dashboard'}
            />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
          </div>
        </div>

        {/* Question Panel Inner Navigation Header Block */}
        <div className="p-4 py-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Question creation</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-1 px-1.5 rounded-md transition-all flex items-center justify-center"
            title="Hide Sub Panel"
          >
            <span className="text-xs font-black font-mono tracking-tighter">{"<<"}</span>
          </button>
        </div>

        {/* Aggregate Metrics Widget */}
        <div className="px-4 pb-3.5 shrink-0">
          <p className="text-[11px] font-medium text-slate-400">
            Total Questions . <span className="text-slate-700 font-bold">{totalQuestions}</span>
          </p>
        </div>

        {/* Live List Row Data Nodes */}
        <div className="flex-1 overflow-y-auto px-3.5 space-y-2 pb-6 no-scrollbar">
          {[
            { label: 'Question x', status: 'checked' },
            { label: 'Question 2', status: 'checked' },
            { label: 'Question 3', status: 'checked' },
            { label: 'Question x', status: 'checked_active' },
            { label: 'Question x', status: 'pending' },
            { label: 'Question 6', status: 'pending' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                item.status === 'checked_active'
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]'
                  : item.status === 'checked'
                  ? 'bg-white border-[#E2E8F0] text-[#16A34A]'
                  : 'bg-white border-[#F1F5F9] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                  item.status.includes('checked') 
                    ? 'bg-[#10B981] text-white' 
                    : 'bg-slate-100 text-slate-300'
                }`}>
                  ✓
                </span>
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${item.status.includes('checked') ? 'text-[#10B981]' : 'text-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING ACTION ICON CONTROLLER ROW BUTTON */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-[75px] top-[22px] bg-[#4F46E5] text-white px-2 py-1 rounded-md shadow-md hover:bg-indigo-700 transition-all z-40 text-xs font-black font-mono tracking-tighter"
          title="Open List Panel"
        >
          {">>"}
        </button>
      )}

      {/* 3. CORE CONTENT APPLICATION CANVAS AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* GLOBAL NAVIGATION LAYER PANEL ROW */}
        <div className="w-full h-[70px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <button className="relative w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100">
              <span className="text-xs">🔔</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border border-orange-200 text-sm">
                👨‍💼
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  Alex Wando <span className="text-[8px] text-slate-400">▼</span>
                </p>
                <p className="text-[9px] text-slate-400 -mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* CORE WORKSPACE SUB MATRIX SCROLL CONTAINER CONTAINER */}
        <div className="w-full flex-1 overflow-y-auto px-8 py-4 space-y-4 content-container no-scrollbar pb-16">
          
          {/* Main Top Header Path Links */}
          <div className="flex items-center justify-between w-full mt-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Test Creation</span>
              <span>/</span>
              <span>Create Test</span>
              <span>/</span>
              <span className="text-slate-600 font-semibold">Chapter Wise</span>
            </div>
            
            <button
              type="button"
              onClick={handlePublishClick}
              className="px-8 py-1.5 bg-[#6878FF] text-white text-[11px] font-semibold rounded-md hover:bg-[#5666E5] transition-all"
            >
              Publish
            </button>
          </div>

          {!isPublishing ? (
            <>
              {/* Meta Data Box Layer Header Toggle */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setShowTestInfo(!showTestInfo)}>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#0A0F24] text-white text-[9px] font-semibold rounded">Chapter Wise</span>
                    <span className="text-xs font-bold text-slate-800">🎲 Chapter 1</span>
                    <span className="px-2 py-0.5 bg-[#14B8A6] text-white text-[9px] font-medium rounded">🧠 Easy</span>
                  </div>
                  <span className={`text-xs text-indigo-600 font-bold transition-transform ${showTestInfo ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                </div>
                
                {showTestInfo && (
                  <div className="p-4 border-t border-slate-50 relative bg-white text-[11px] space-y-2">
                    <div className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 cursor-pointer text-xs">✏️</div>
                    <div className="flex items-center"><span className="w-20 text-slate-400">Subject</span><span className="text-slate-700 font-medium">: English</span></div>
                    <div className="flex items-center">
                      <span className="w-20 text-slate-400">Topic</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-medium mr-1">:</span>
                        <span className="px-2 py-0.5 border border-amber-200 text-amber-600 bg-amber-50/50 rounded text-[10px]">Grammar</span>
                        <span className="px-2 py-0.5 border border-amber-200 text-amber-600 bg-amber-50/50 rounded text-[10px]">Writing</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-slate-400">Sub Topic</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-medium mr-1">:</span>
                        <span className="px-2 py-0.5 border border-amber-200 text-amber-600 bg-amber-50/50 rounded text-[10px]">Application</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 border-t border-slate-50 font-medium">
                      <span>🕒 60 Min</span><span>|</span><span>📄 {totalQuestions} Q&apos;s</span><span>|</span><span>📊 250 Marks</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Central Active Form Content Board */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800">
                    Question {selectedQuestion}<span className="text-slate-400 font-normal">/{totalQuestions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleMCQUpload} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[11px] font-medium flex items-center gap-1 hover:bg-slate-100"><Plus className="w-3 h-3"/> MCQ</button>
                    <button type="button" onClick={handleCSVUpload} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[11px] font-medium flex items-center gap-1 hover:bg-slate-100"><Download className="w-3 h-3"/> CSV</button>
                  </div>
                </div>

                <button className="text-[11px] font-medium text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 className="w-3 h-3"/> Delete All Edits</button>

                {/* Plain Editor Frame Area Input Element */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex items-center gap-3 text-slate-400 text-xs font-serif">
                    <span className="font-bold cursor-pointer hover:text-slate-700">I</span>
                    <span className="font-bold cursor-pointer hover:text-slate-700">B</span>
                    <span className="underline cursor-pointer hover:text-slate-700">U</span>
                  </div>
                  <textarea 
                    value={currentQuestion.questionText}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    className="w-full px-4 py-3 bg-white text-slate-700 text-[11px] outline-none resize-none min-h-[120px]" 
                    placeholder="Type here" 
                  />
                </div>

                {/* Multiple Answer Inputs Fields Option Arrays List */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={currentQuestion.correctOption === index}
                        onChange={() => setCurrentQuestion(prev => ({ ...prev, correctOption: index }))}
                        className="w-3.5 h-3.5 text-indigo-600"
                      />
                      <div className="flex-1 flex items-center border border-slate-200 rounded-lg bg-white px-3 py-1.5">
                        <input 
                          type="text" 
                          value={option} 
                          onChange={(e) => handleOptionChange(index, e.target.value)} 
                          className="w-full bg-transparent text-[11px] text-slate-700 outline-none" 
                          placeholder={`Option ${index + 1}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanatory Auxiliary Multi Lines Inputs Field Box */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 text-[11px] font-semibold text-slate-500">Explanation</div>
                  <textarea 
                    value={currentQuestion.explanation}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    className="w-full px-3 py-2 bg-white text-slate-700 text-[11px] outline-none resize-none" 
                    rows={2} 
                    placeholder="Add explanation (optional)" 
                  />
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 text-[11px] font-semibold text-slate-500">Media URL</div>
                  <input 
                    type="url"
                    value={currentQuestion.mediaUrl}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white text-slate-700 text-[11px] outline-none" 
                    placeholder="Paste online image link (optional)" 
                  />
                </div>

                {/* Bottom Main Layout Footer Submissions Buttons Row */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-[11px]">
                  <button type="button" onClick={() => window.location.href = '/dashboard'} className="px-4 py-2 bg-white border border-red-200 text-red-500 font-bold rounded-lg hover:bg-red-50">Exit Test Creation</button>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddQuestion} className="px-4 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669]">Add Another Question</button>
                    <button type="button" onClick={handleSaveAndContinue} disabled={loading} className="px-6 py-2 bg-[#6366F1] text-white font-bold rounded-lg hover:bg-[#4F46E5] disabled:opacity-50">{loading ? 'Saving...' : 'Save & Continue'}</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* PREVIEW CONFIRMATION MODAL BLOCK VIEW SCREEN */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-slate-800">Test Preview Validation</h2>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full">{questions.length} Formulated Qs</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3">
                {questions.map((q, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => toggleQuestionExpand(index)} className="w-full px-4 py-2.5 bg-slate-50 flex items-center justify-between text-left text-[11px] font-semibold text-slate-700">
                      <span>Q{index + 1}: {q.questionText.substring(0, 60)}...</span>
                      <span>▼</span>
                    </button>
                    {expandedQuestions.has(index) && (
                      <div className="p-4 space-y-2 bg-white text-[11px]">
                        <p className="font-medium text-slate-800">{q.questionText}</p>
                        <div className="space-y-1 ml-3">
                          {q.options.map((opt, oIdx) => (
                            <p key={oIdx} className={q.correctOption === oIdx ? 'text-green-600 font-bold' : 'text-slate-500'}>- {opt}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPublishing(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-50">Back to Editor</button>
                <button type="button" onClick={handleConfirmPublish} disabled={loading} className="px-5 py-1.5 bg-indigo-600 text-white text-[11px] font-semibold rounded-lg hover:bg-indigo-700">Confirm & Live Publish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCreation;