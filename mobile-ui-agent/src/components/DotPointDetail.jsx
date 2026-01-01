import React from 'react';
import { motion } from 'framer-motion';

const DotPointDetail = ({
  dotPointId,
  onBack,
  onContentSelect,
  onQuizSelect,
  pathwayData,
  trackContentAccess,
  isContentAccessible,
  hasAccessedAllContent,
  isQuizAccessible,
  getDotPointStatus
}) => {
  
  // Find the dot point data
  const findDotPointData = (dotPointId) => {
    for (const iq of Object.values(pathwayData.inquiryQuestions)) {
      for (const dotPoint of Object.values(iq.dotPoints)) {
        if (dotPoint.id === dotPointId) {
          return { dotPoint, iqTitle: iq.title };
        }
      }
    }
    return null;
  };

  const dotPointData = findDotPointData(dotPointId);
  
  if (!dotPointData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dot point not found</p>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
            Back to Pathway
          </button>
        </div>
      </div>
    );
  }

  const { dotPoint, iqTitle } = dotPointData;
  const status = getDotPointStatus(dotPointId);
  const isAccessible = isContentAccessible(dotPointId);
  const allContentAccessed = hasAccessedAllContent(dotPointId);

  const handleContentAccess = (contentType) => {
    trackContentAccess(dotPointId, contentType);
    onContentSelect(contentType);
  };

  const renderContentButton = (contentType, contentInfo) => {
    const isAccessed = status.contentAccess?.[contentType]?.accessed || false;
    const isClickable = isAccessible || isAccessed;

    return (
      <button
        onClick={() => {
          if (isClickable) {
            handleContentAccess(contentType);
          }
        }}
        disabled={!isClickable}
        className={`p-4 rounded-xl border-2 transition-all w-full text-left ${
          isAccessed
            ? 'border-green-300 bg-green-50 hover:bg-green-100'
            : isClickable
            ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 cursor-pointer'
            : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {contentType === 'podcast' ? '' : contentType === 'video' ? '' : ''}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{contentInfo.title}</h4>
            <p className="text-sm text-gray-600">{contentInfo.duration}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isAccessed && (
              <span className="text-green-600 text-sm"> Completed</span>
            )}
            {!isClickable && (
              <span className="text-gray-500 text-sm"> Locked</span>
            )}
          </div>
        </div>
      </button>
    );
  };

  const renderQuizButton = (quizType, quizData) => {
    const isAccessible = isQuizAccessible(dotPointId, quizType);
    const quizProgress = status.quizProgress?.[quizType];
    const isPassed = quizType === 'quickQuiz' 
      ? quizProgress?.quickQuizPassed 
      : quizProgress?.longResponsePassed;

    return (
      <button
        onClick={() => {
          if (isAccessible || !isPassed) {
            onQuizSelect(quizType);
          }
        }}
        disabled={!isAccessible && isPassed}
        className={`p-4 rounded-xl border-2 transition-all w-full text-left ${
          isPassed
            ? 'border-green-300 bg-green-50'
            : isAccessible
            ? 'border-purple-300 bg-purple-50 hover:bg-purple-100 cursor-pointer'
            : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {quizType === 'quickQuiz' ? '' : ''}
            </span>
            <div>
              <h4 className="font-semibold text-gray-900">
                {quizType === 'quickQuiz' ? 'Quick Quiz' : 'Long Response Quiz'}
              </h4>
              <p className="text-sm text-gray-600">
                {quizData.questionCount} questions  {quizData.timeLimit} min
              </p>
            </div>
          </div>
          <div className="text-right">
            {isPassed ? (
              <div>
                <span className="text-green-600 text-sm font-medium"> Passed</span>
                <div className="text-xs text-gray-500">
                  Best: {quizType === 'quickQuiz' 
                    ? quizProgress?.quickQuizBestScore 
                    : quizProgress?.longResponseBestScore || 0}%
                </div>
              </div>
            ) : !isAccessible ? (
              <span className="text-gray-500 text-sm"> Complete content first</span>
            ) : (
              <span className="text-purple-600 text-sm font-medium">Ready to Start</span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{status.icon}</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{dotPoint.title}</h1>
              <p className="text-sm text-gray-600">{iqTitle}</p>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border-2 mb-6 ${
            status.status === 'completed'
              ? 'border-green-300 bg-green-50'
              : status.status === 'in_progress'
              ? 'border-blue-300 bg-blue-50'
              : status.status === 'available'
              ? 'border-purple-300 bg-purple-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Progress Overview</h2>
              <p className="text-gray-600">{dotPoint.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{status.progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-lg ${allContentAccessed ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className="text-lg">{allContentAccessed ? '' : ''}</div>
              <div className="text-sm font-medium">Content</div>
            </div>
            <div className={`p-3 rounded-lg ${
              status.quizProgress?.quickQuiz?.quickQuizPassed ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <div className="text-lg">
                {status.quizProgress?.quickQuiz?.quickQuizPassed ? '' : ''}
              </div>
              <div className="text-sm font-medium">Quick Quiz</div>
            </div>
            <div className={`p-3 rounded-lg ${
              status.quizProgress?.longResponse?.longResponsePassed ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <div className="text-lg">
                {status.quizProgress?.longResponse?.longResponsePassed ? '' : ''}
              </div>
              <div className="text-sm font-medium">Long Response</div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mb-6"
        >
          <h3 className="font-bold text-gray-900 text-lg mb-4"> Study Content</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete all content before quizzes unlock. Click on each item to access.
          </p>
          <div className="space-y-3">
            {renderContentButton('podcast', dotPoint.content.podcast)}
            {renderContentButton('video', dotPoint.content.video)}
            {renderContentButton('slides', dotPoint.content.slides)}
          </div>
        </motion.div>

        {/* Quiz Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 text-lg mb-4"> Assessments</h3>
          <p className="text-gray-600 text-sm mb-4">
            Score 65% or higher on both quizzes to unlock the next dot point.
          </p>
          <div className="space-y-3">
            {renderQuizButton('quickQuiz', dotPoint.quizzes.quickQuiz)}
            {renderQuizButton('longResponse', dotPoint.quizzes.longResponse)}
          </div>
        </motion.div>

        {/* Learning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 mt-6"
        >
          <h3 className="font-bold text-blue-900 mb-2"> Study Tips</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li> Review all content before attempting quizzes</li>
            <li> Take notes while studying to improve retention</li>
            <li> You can retake quizzes immediately if you don&apos;t pass</li>
            <li> Focus on understanding concepts, not just memorization</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DotPointDetail;
