import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Module5AdminDashboard = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('overview'); // overview, content-upload, questions-upload, analytics
  const [moduleOverview, setModuleOverview] = useState(null);
  const [selectedDotPoint, setSelectedDotPoint] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModuleOverview();
  }, []);

  const loadModuleOverview = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the biology-agent API
      const response = await fetch('/api/biology/module5-admin/overview');
      if (response.ok) {
        const data = await response.json();
        setModuleOverview(data.overview);
      } else {
        // Fallback to mock data for demo
        setModuleOverview(mockModuleOverview);
      }
    } catch (error) {
      console.error('Failed to load module overview:', error);
      setModuleOverview(mockModuleOverview);
    }
    setLoading(false);
  };

  // Mock data for demonstration
  const mockModuleOverview = {
    moduleId: 'biology-module-5',
    moduleName: 'Module 5: Reproduction',
    totalDotPoints: 13,
    inquiryQuestions: {
      IQ1: {
        title: 'How does reproduction ensure the continuity of a species?',
        dotPoints: {
          'IQ1.1': {
            content: { podcast: true, video: true, slides: false },
            questions: { 
              quickQuiz: { available: true, count: 8 },
              longResponse: { available: false, count: 0 }
            },
            contentComplete: false,
            questionsComplete: false
          },
          'IQ1.2': {
            content: { podcast: false, video: false, slides: false },
            questions: { 
              quickQuiz: { available: false, count: 0 },
              longResponse: { available: false, count: 0 }
            },
            contentComplete: false,
            questionsComplete: false
          },
          'IQ1.3': {
            content: { podcast: false, video: false, slides: false },
            questions: { 
              quickQuiz: { available: false, count: 0 },
              longResponse: { available: false, count: 0 }
            },
            contentComplete: false,
            questionsComplete: false
          }
        }
      },
      IQ2: {
        title: 'How is the cell cycle controlled during development?',
        dotPoints: {
          'IQ2.1': {
            content: { podcast: false, video: false, slides: false },
            questions: { 
              quickQuiz: { available: false, count: 0 },
              longResponse: { available: false, count: 0 }
            },
            contentComplete: false,
            questionsComplete: false
          },
          'IQ2.2': {
            content: { podcast: false, video: false, slides: false },
            questions: { 
              quickQuiz: { available: false, count: 0 },
              longResponse: { available: false, count: 0 }
            },
            contentComplete: false,
            questionsComplete: false
          }
        }
      }
      // ... other IQ sections would follow similar pattern
    },
    statistics: {
      contentCompletion: 15,
      questionsCompletion: 8,
      totalContentItems: 39, // 13 dot points * 3 content types
      completedContentItems: 6,
      totalQuizTypes: 26, // 13 dot points * 2 quiz types
      completedQuizTypes: 2,
      readyForLaunch: false
    }
  };

  const handleContentUpload = async (dotPointId, contentType, file, metadata) => {
    setUploadProgress({ status: 'uploading', progress: 0 });
    
    try {
      const formData = new FormData();
      formData.append('contentFile', file);
      formData.append('title', metadata.title);
      formData.append('description', metadata.description || '');

      const response = await fetch(`/api/biology/module5-admin/content/upload/${dotPointId}/${contentType}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadProgress({ status: 'success', message: `${contentType} uploaded successfully!` });
        
        // Refresh overview
        setTimeout(() => {
          loadModuleOverview();
          setUploadProgress(null);
        }, 2000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadProgress({ status: 'error', message: error.message });
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  const handleQuestionsUpload = async (dotPointId, quizType, file) => {
    setUploadProgress({ status: 'uploading', progress: 0 });
    
    try {
      const formData = new FormData();
      formData.append('questionsFile', file);
      formData.append('quizType', quizType);

      const response = await fetch(`/api/biology/module5-admin/questions/upload/${dotPointId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadProgress({ status: 'success', message: `Questions uploaded successfully!` });
        
        // Refresh overview
        setTimeout(() => {
          loadModuleOverview();
          setUploadProgress(null);
        }, 2000);
      } else {
        throw new Error('Questions upload failed');
      }
    } catch (error) {
      setUploadProgress({ status: 'error', message: error.message });
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{moduleOverview.statistics.contentCompletion}%</div>
            <div className="text-sm text-gray-600">Content Complete</div>
            <div className="text-xs text-gray-500 mt-1">
              {moduleOverview.statistics.completedContentItems}/{moduleOverview.statistics.totalContentItems} items
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{moduleOverview.statistics.questionsCompletion}%</div>
            <div className="text-sm text-gray-600">Questions Complete</div>
            <div className="text-xs text-gray-500 mt-1">
              {moduleOverview.statistics.completedQuizTypes}/{moduleOverview.statistics.totalQuizTypes} quiz types
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{moduleOverview.totalDotPoints}</div>
            <div className="text-sm text-gray-600">Dot Points</div>
            <div className="text-xs text-gray-500 mt-1">13 total sections</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <div className="text-center">
            <div className={`text-3xl font-bold ${moduleOverview.statistics.readyForLaunch ? 'text-green-600' : 'text-yellow-600'}`}>
              {moduleOverview.statistics.readyForLaunch ? '' : ''}
            </div>
            <div className="text-sm text-gray-600">Launch Ready</div>
            <div className="text-xs text-gray-500 mt-1">
              {moduleOverview.statistics.readyForLaunch ? 'Ready to go!' : 'Needs more content'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('content-upload')}
            className="p-4 text-left rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                
              </div>
              <div>
                <div className="font-semibold text-blue-900">Upload Content</div>
                <div className="text-sm text-blue-700">Add podcasts, videos, slides</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('questions-upload')}
            className="p-4 text-left rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                
              </div>
              <div>
                <div className="font-semibold text-purple-900">Upload Questions</div>
                <div className="text-sm text-purple-700">Add quiz questions</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className="p-4 text-left rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                
              </div>
              <div>
                <div className="font-semibold text-green-900">View Analytics</div>
                <div className="text-sm text-green-700">Content usage stats</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Content Overview by Inquiry Question */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Content Status by Inquiry Question</h3>
        {Object.entries(moduleOverview.inquiryQuestions).map(([iqId, iq]) => (
          <div key={iqId} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h4 className="font-semibold text-gray-900 mb-4">{iqId}: {iq.title}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(iq.dotPoints).map(([dotPointId, dotPoint]) => (
                <div key={dotPointId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">{dotPointId}</h5>
                    <div className="flex space-x-1">
                      {dotPoint.contentComplete ? (
                        <span className="text-green-600"></span>
                      ) : (
                        <span className="text-gray-400"></span>
                      )}
                      {dotPoint.questionsComplete ? (
                        <span className="text-purple-600"></span>
                      ) : (
                        <span className="text-gray-400"></span>
                      )}
                    </div>
                  </div>

                  {/* Content Status */}
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Podcast:</span>
                      <span className={dotPoint.content.podcast ? 'text-green-600' : 'text-red-600'}>
                        {dotPoint.content.podcast ? '' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Video:</span>
                      <span className={dotPoint.content.video ? 'text-green-600' : 'text-red-600'}>
                        {dotPoint.content.video ? '' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slides:</span>
                      <span className={dotPoint.content.slides ? 'text-green-600' : 'text-red-600'}>
                        {dotPoint.content.slides ? '' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Questions Status */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Quick Quiz:</span>
                      <span className={dotPoint.questions.quickQuiz.available ? 'text-green-600' : 'text-red-600'}>
                        {dotPoint.questions.quickQuiz.available ? 
                          ` (${dotPoint.questions.quickQuiz.count})` : ' (0)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Long Response:</span>
                      <span className={dotPoint.questions.longResponse.available ? 'text-green-600' : 'text-red-600'}>
                        {dotPoint.questions.longResponse.available ? 
                          ` (${dotPoint.questions.longResponse.count})` : ' (0)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDotPoint(dotPointId);
                      setCurrentView('content-upload');
                    }}
                    className="mt-3 w-full text-xs bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors"
                  >
                    Manage Content
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentUpload = () => (
    <ContentUploadForm
      selectedDotPoint={selectedDotPoint}
      onUpload={handleContentUpload}
      onBack={() => setCurrentView('overview')}
    />
  );

  const renderQuestionsUpload = () => (
    <QuestionsUploadForm
      selectedDotPoint={selectedDotPoint}
      onUpload={handleQuestionsUpload}
      onBack={() => setCurrentView('overview')}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Module 5 Admin</h1>
                <p className="text-sm text-gray-600">Content Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* View Navigation */}
          <div className="flex space-x-2">
            {[
              { key: 'overview', label: 'Overview', icon: '' },
              { key: 'content-upload', label: 'Content', icon: '' },
              { key: 'questions-upload', label: 'Questions', icon: '' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentView === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/70 text-gray-600 hover:bg-blue-100'
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg ${
              uploadProgress.status === 'success' ? 'bg-green-500' :
              uploadProgress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}
          >
            <div className="flex items-center space-x-3">
              {uploadProgress.status === 'uploading' && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {uploadProgress.status === 'success' && <span></span>}
              {uploadProgress.status === 'error' && <span></span>}
              <span>{uploadProgress.message || 'Uploading...'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentView === 'overview' && renderOverview()}
            {currentView === 'content-upload' && renderContentUpload()}
            {currentView === 'questions-upload' && renderQuestionsUpload()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Content Upload Form Component
const ContentUploadForm = ({ selectedDotPoint, onUpload, onBack }) => {
  const [dotPointId, setDotPointId] = useState(selectedDotPoint || 'IQ1.1');
  const [contentType, setContentType] = useState('podcast');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const dotPoints = [
    'IQ1.1', 'IQ1.2', 'IQ1.3',
    'IQ2.1', 'IQ2.2',
    'IQ3.1', 'IQ3.2', 'IQ3.3',
    'IQ4.1', 'IQ4.2', 'IQ4.3',
    'IQ5.1', 'IQ5.2'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title) return;

    onUpload(dotPointId, contentType, file, { title, description });
    
    // Reset form
    setTitle('');
    setDescription('');
    setFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Upload Content</h3>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dot Point
              </label>
              <select
                value={dotPointId}
                onChange={(e) => setDotPointId(e.target.value)}
                className="w-full p-2 border rounded-lg focus:border-blue-500"
              >
                {dotPoints.map(dp => (
                  <option key={dp} value={dp}>{dp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 border rounded-lg focus:border-blue-500"
              >
                <option value="podcast">Podcast</option>
                <option value="video">Video</option>
                <option value="slides">Slides</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              className="w-full p-2 border rounded-lg focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter content description (optional)"
              rows={3}
              className="w-full p-2 border rounded-lg focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File *
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept={
                contentType === 'podcast' ? 'audio/*' :
                contentType === 'video' ? 'video/*' :
                '.pdf,.ppt,.pptx'
              }
              className="w-full p-2 border rounded-lg focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 50MB. Accepted formats: {
                contentType === 'podcast' ? 'MP3, WAV, M4A' :
                contentType === 'video' ? 'MP4, MOV, AVI' :
                'PDF, PPT, PPTX'
              }
            </p>
          </div>

          <button
            type="submit"
            disabled={!file || !title}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Upload {contentType}
          </button>
        </form>
      </div>
    </div>
  );
};

// Questions Upload Form Component  
const QuestionsUploadForm = ({ selectedDotPoint, onUpload, onBack }) => {
  const [dotPointId, setDotPointId] = useState(selectedDotPoint || 'IQ1.1');
  const [quizType, setQuizType] = useState('quickQuiz');
  const [file, setFile] = useState(null);

  const dotPoints = [
    'IQ1.1', 'IQ1.2', 'IQ1.3',
    'IQ2.1', 'IQ2.2', 
    'IQ3.1', 'IQ3.2', 'IQ3.3',
    'IQ4.1', 'IQ4.2', 'IQ4.3',
    'IQ5.1', 'IQ5.2'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    onUpload(dotPointId, quizType, file);
    
    // Reset form
    setFile(null);
  };

  const sampleFormat = quizType === 'quickQuiz' ? {
    example: [{
      id: 'sample-1',
      type: 'multiple-choice',
      question: 'Which process ensures genetic diversity in sexual reproduction?',
      options: ['Mitosis', 'Meiosis', 'Binary fission', 'Budding'],
      correctAnswer: 1,
      explanation: 'Meiosis creates genetic diversity through crossing over and independent assortment.'
    }]
  } : {
    example: [{
      id: 'sample-lr-1',
      question: 'Explain how meiosis contributes to genetic variation in sexually reproducing organisms.',
      marks: 6,
      expectedSentences: 4,
      sentencePool: [
        'Meiosis involves crossing over between homologous chromosomes during prophase I.',
        'Independent assortment occurs during metaphase I when chromosome pairs align randomly.',
        'These processes create new combinations of alleles in gametes.',
        'Sexual reproduction combines gametes from two parents, further increasing variation.'
      ],
      keyConceptsRequired: ['crossing over', 'independent assortment', 'genetic variation']
    }]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Upload Questions</h3>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dot Point
                </label>
                <select
                  value={dotPointId}
                  onChange={(e) => setDotPointId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:border-blue-500"
                >
                  {dotPoints.map(dp => (
                    <option key={dp} value={dp}>{dp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Type
                </label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:border-blue-500"
                >
                  <option value="quickQuiz">Quick Quiz (Multiple Choice, etc.)</option>
                  <option value="longResponse">Long Response (HSC Style)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questions File (JSON) *
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".json"
                  className="w-full p-2 border rounded-lg focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a JSON file containing an array of questions in the correct format.
                </p>
              </div>

              <button
                type="submit"
                disabled={!file}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Upload {quizType} Questions
              </button>
            </form>
          </div>

          {/* Format Example */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {quizType === 'quickQuiz' ? 'Quick Quiz' : 'Long Response'} Format Example
            </h4>
            <div className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-96">
              <pre>{JSON.stringify(sampleFormat.example, null, 2)}</pre>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium mb-1">Required fields for {quizType}:</p>
              <ul className="list-disc list-inside space-y-1">
                {quizType === 'quickQuiz' ? (
                  <>
                    <li><code>question</code>: Question text</li>
                    <li><code>type</code>: Question type (multiple-choice, true-false, etc.)</li>
                    <li><code>correctAnswer</code>: Correct answer (index for MC, boolean for T/F)</li>
                    <li><code>explanation</code>: Answer explanation</li>
                  </>
                ) : (
                  <>
                    <li><code>question</code>: HSC-style question</li>
                    <li><code>marks</code>: Question marks/points</li>
                    <li><code>sentencePool</code>: Array of sentence options for drag-drop</li>
                    <li><code>expectedSentences</code>: Number of sentences students should select</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module5AdminDashboard;
