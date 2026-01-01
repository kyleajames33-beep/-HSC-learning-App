import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, Clock, CheckCircle, XCircle, Star, AlertTriangle, Lightbulb } from 'lucide-react';

const Module5LongResponse = ({ dotPointId, onBackToPathway, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExpertComparison, setShowExpertComparison] = useState(false);
  const [feedbackLevel, setFeedbackLevel] = useState('real-time'); // 'real-time', 'after-submission', 'expert-only'

  // Question data with advanced long response types
  const getLongResponseQuestions = (dotPointId) => {
    const questionsByDotPoint = {
      'IQ3.1': [
        {
          id: 'IQ3.1-LR-001',
          type: 'argument-constructor',
          topic: 'Genetic Engineering in Agriculture',
          prompt: 'Should genetic engineering be widely used in agricultural crop production?',
          position: 'support', // 'support' or 'oppose'
          sentences: [
            {
              id: 'arg1',
              text: 'Genetic engineering can create drought-resistant crops that survive in harsh climates.',
              strength: 'strong',
              category: 'main-point'
            },
            {
              id: 'arg2', 
              text: 'GM crops can reduce pesticide use by incorporating natural pest resistance.',
              strength: 'strong',
              category: 'supporting-evidence'
            },
            {
              id: 'arg3',
              text: 'Some people are concerned about unknown long-term effects.',
              strength: 'weak',
              category: 'counterargument'
            },
            {
              id: 'arg4',
              text: 'Golden Rice provides essential vitamin A to prevent blindness in developing countries.',
              strength: 'strong',
              category: 'example'
            },
            {
              id: 'arg5',
              text: 'Traditional breeding is too slow to address climate change challenges.',
              strength: 'medium',
              category: 'supporting-evidence'
            },
            {
              id: 'arg6',
              text: 'Genetic engineering allows precise trait introduction without unwanted characteristics.',
              strength: 'strong',
              category: 'main-point'
            }
          ],
          expertResponse: {
            structure: ['arg6', 'arg1', 'arg2', 'arg5', 'arg4'],
            reasoning: 'Expert response starts with the strongest scientific principle, then provides evidence and examples.'
          },
          rubric: {
            excellent: 'Uses 4-5 strongest arguments in logical order with clear scientific reasoning',
            good: 'Uses 3-4 strong arguments with mostly logical flow',
            satisfactory: 'Uses 2-3 arguments but may include weaker evidence or poor ordering',
            needs_improvement: 'Uses fewer than 3 arguments or includes weak/irrelevant evidence'
          }
        },
        {
          id: 'IQ3.1-LR-002',
          type: 'hypothesis-to-conclusion',
          scenario: 'Inheritance Pattern Investigation',
          experimentalData: {
            setup: 'Cross between two heterozygous plants (Aa  Aa) for flower color',
            results: 'F1 generation: 73 red flowers, 27 white flowers (total 100 offspring)',
            observations: ['Red flowers appear in approximately 3:1 ratio', 'White flowers only from specific crosses', 'No intermediate colors observed']
          },
          sentences: [
            {
              id: 'hyp1',
              text: 'If red flower color is dominant over white, then crosses between heterozygous plants should produce a 3:1 phenotype ratio.',
              category: 'hypothesis',
              strength: 'strong'
            },
            {
              id: 'obs1', 
              text: 'The experimental results show 73 red and 27 white flowers, which is close to the expected 3:1 ratio.',
              category: 'observation',
              strength: 'strong'
            },
            {
              id: 'ana1',
              text: 'Chi-square analysis confirms the results are not significantly different from expected Mendelian inheritance.',
              category: 'analysis',
              strength: 'strong'
            },
            {
              id: 'con1',
              text: 'Therefore, red flower color follows simple dominant inheritance over white flower color.',
              category: 'conclusion',
              strength: 'strong'
            },
            {
              id: 'ext1',
              text: 'This inheritance pattern could be useful for breeding programs selecting flower color.',
              category: 'extension',
              strength: 'medium'
            },
            {
              id: 'weak1',
              text: 'The plants probably grew better in the greenhouse environment.',
              category: 'irrelevant',
              strength: 'weak'
            }
          ],
          correctFlow: ['hyp1', 'obs1', 'ana1', 'con1', 'ext1'],
          expertResponse: {
            structure: ['hyp1', 'obs1', 'ana1', 'con1', 'ext1'],
            reasoning: 'Scientific reasoning flows from hypothesis through observation and analysis to conclusion and implications.'
          }
        }
      ],
      'IQ3.2': [
        {
          id: 'IQ3.2-LR-001',
          type: 'compare-contrast-builder',
          prompt: 'Compare and contrast mitosis and meiosis in terms of their processes and outcomes.',
          categories: {
            similarities: 'Similarities',
            differences: 'Key Differences',
            outcomes: 'Different Outcomes'
          },
          sentences: [
            {
              id: 'sim1',
              text: 'Both processes involve DNA replication before division begins.',
              category: 'similarities',
              strength: 'strong'
            },
            {
              id: 'sim2',
              text: 'Both use spindle fibers to move chromosomes during division.',
              category: 'similarities', 
              strength: 'strong'
            },
            {
              id: 'diff1',
              text: 'Mitosis produces two identical diploid cells, while meiosis produces four genetically different haploid gametes.',
              category: 'differences',
              strength: 'strong'
            },
            {
              id: 'diff2',
              text: 'Meiosis includes crossing over and independent assortment to create genetic variation.',
              category: 'differences',
              strength: 'strong'
            },
            {
              id: 'out1',
              text: 'Mitosis enables growth and repair in multicellular organisms.',
              category: 'outcomes',
              strength: 'strong'
            },
            {
              id: 'out2',
              text: 'Meiosis is essential for sexual reproduction and genetic diversity in populations.',
              category: 'outcomes',
              strength: 'strong'
            },
            {
              id: 'weak1',
              text: 'Both processes happen in all living organisms.',
              category: 'similarities',
              strength: 'weak',
              error: 'Not all organisms undergo both processes'
            }
          ],
          expertResponse: {
            similarities: ['sim1', 'sim2'],
            differences: ['diff1', 'diff2'], 
            outcomes: ['out1', 'out2']
          }
        },
        {
          id: 'IQ3.2-LR-002',
          type: 'sentence-ranking',
          prompt: 'Rank the following statements about genetic testing in order of importance for medical decision-making, then arrange them into a coherent response.',
          sentences: [
            {
              id: 'rank1',
              text: 'Genetic testing can identify disease predisposition before symptoms appear.',
              importance: 1,
              tier: 'main-point'
            },
            {
              id: 'rank2',
              text: 'Test results must be interpreted by qualified genetic counselors.',
              importance: 2,
              tier: 'supporting-evidence'
            },
            {
              id: 'rank3',
              text: 'Privacy and insurance discrimination concerns must be addressed.',
              importance: 3,
              tier: 'supporting-evidence'
            },
            {
              id: 'rank4',
              text: 'Family members may also be affected by test results.',
              importance: 4,
              tier: 'example'
            },
            {
              id: 'rank5',
              text: 'Testing technology continues to improve in accuracy.',
              importance: 5,
              tier: 'supporting-evidence'
            },
            {
              id: 'rank6',
              text: 'Some genetic variants have unknown clinical significance.',
              importance: 6,
              tier: 'example'
            }
          ],
          connectorOptions: [
            'Therefore', 'However', 'Additionally', 'Furthermore', 'In contrast', 'For example', 'Consequently', 'Nevertheless'
          ],
          expertRanking: ['rank1', 'rank2', 'rank3', 'rank5', 'rank4', 'rank6'],
          expertConnectors: {
            'rank1-rank2': 'Therefore',
            'rank2-rank3': 'Additionally', 
            'rank3-rank5': 'Furthermore',
            'rank5-rank4': 'For example',
            'rank4-rank6': 'However'
          }
        }
      ],
      'IQ4.1': [
        {
          id: 'IQ4.1-LR-001',
          type: 'evidence-hierarchy',
          prompt: 'Organize evidence for Hardy-Weinberg equilibrium into a hierarchical structure with main points, supporting evidence, and specific examples.',
          sentences: [
            {
              id: 'main1',
              text: 'Hardy-Weinberg equilibrium describes allele frequency stability in populations.',
              tier: 'main-point',
              strength: 'strong'
            },
            {
              id: 'main2', 
              text: 'Five conditions must be met for Hardy-Weinberg equilibrium.',
              tier: 'main-point',
              strength: 'strong'
            },
            {
              id: 'support1',
              text: 'No mutations can occur that change allele frequencies.',
              tier: 'supporting-evidence',
              strength: 'strong',
              parentId: 'main2'
            },
            {
              id: 'support2',
              text: 'Population size must be large enough to prevent genetic drift.',
              tier: 'supporting-evidence', 
              strength: 'strong',
              parentId: 'main2'
            },
            {
              id: 'support3',
              text: 'No gene flow can occur between populations.',
              tier: 'supporting-evidence',
              strength: 'strong', 
              parentId: 'main2'
            },
            {
              id: 'example1',
              text: 'Human ABO blood types follow Hardy-Weinberg predictions in large populations.',
              tier: 'example',
              strength: 'medium',
              parentId: 'main1'
            },
            {
              id: 'example2',
              text: 'Small island populations often deviate from Hardy-Weinberg due to genetic drift.',
              tier: 'example',
              strength: 'medium',
              parentId: 'support2'
            },
            {
              id: 'weak1',
              text: 'Hardy-Weinberg was discovered in 1908.',
              tier: 'irrelevant',
              strength: 'weak'
            }
          ],
          hierarchyStructure: {
            'main-point': { label: 'Main Points', maxItems: 3 },
            'supporting-evidence': { label: 'Supporting Evidence', maxItems: 5 },
            'example': { label: 'Specific Examples', maxItems: 4 }
          }
        },
        {
          id: 'IQ4.1-LR-002',
          type: 'mistake-correction',
          prompt: 'Identify and correct errors in the following statements about population genetics, then arrange them into a coherent explanation.',
          sentences: [
            {
              id: 'correct1',
              text: 'Natural selection increases the frequency of beneficial alleles in populations.',
              hasError: false,
              strength: 'strong'
            },
            {
              id: 'error1',
              text: 'Genetic drift always increases genetic diversity in populations.',
              hasError: true,
              error: 'Genetic drift typically DECREASES genetic diversity, especially in small populations',
              correctedText: 'Genetic drift typically decreases genetic diversity, especially in small populations.',
              strength: 'strong'
            },
            {
              id: 'error2', 
              text: 'Gene flow always occurs between populations that are geographically close.',
              hasError: true,
              error: 'Gene flow can occur between distant populations through migration',
              correctedText: 'Gene flow can occur between populations regardless of geographic distance through migration.',
              strength: 'medium'
            },
            {
              id: 'correct2',
              text: 'Mutation introduces new alleles that can be acted upon by selection.',
              hasError: false,
              strength: 'strong'
            },
            {
              id: 'error3',
              text: 'Hardy-Weinberg equilibrium is commonly observed in natural populations.',
              hasError: true,
              error: 'Hardy-Weinberg equilibrium is RARELY observed in natural populations due to evolutionary forces',
              correctedText: 'Hardy-Weinberg equilibrium is rarely observed in natural populations due to various evolutionary forces.',
              strength: 'medium'
            },
            {
              id: 'correct3',
              text: 'Population bottlenecks can lead to founder effects in new populations.',
              hasError: false,
              strength: 'medium'
            }
          ],
          expertOrder: ['correct1', 'error1', 'error2', 'correct2', 'error3', 'correct3']
        }
      ]
    };

    return questionsByDotPoint[dotPointId] || [];
  };

  // Initialize quiz
  useEffect(() => {
    const loadQuestions = () => {
      try {
        const longResponseQuestions = getLongResponseQuestions(dotPointId);
        if (longResponseQuestions.length > 0) {
          setQuestions(longResponseQuestions);
          setTimeRemaining(45 * 60); // 45 minutes for long response
          setQuizStartTime(Date.now());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading long response questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [dotPointId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const handleTimeUp = () => {
    if (!showResults) {
      finishQuiz();
    }
  };

  // Handle drag and drop for sentence arrangement
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const question = questions[currentQuestionIndex];
    const currentResponse = responses[question.id] || {};
    
    if (question.type === 'argument-constructor') {
      const newOrder = Array.from(currentResponse.sentenceOrder || []);
      const [reorderedSentence] = newOrder.splice(result.source.index, 1);
      newOrder.splice(result.destination.index, 0, reorderedSentence);
      
      updateResponse(question.id, { ...currentResponse, sentenceOrder: newOrder });
    } else if (question.type === 'compare-contrast-builder') {
      // Handle category-based drag and drop
      const sourceCategory = result.source.droppableId;
      const destCategory = result.destination.droppableId;
      
      const newResponse = { ...currentResponse };
      if (!newResponse[sourceCategory]) newResponse[sourceCategory] = [];
      if (!newResponse[destCategory]) newResponse[destCategory] = [];
      
      const [movedSentence] = newResponse[sourceCategory].splice(result.source.index, 1);
      newResponse[destCategory].splice(result.destination.index, 0, movedSentence);
      
      updateResponse(question.id, newResponse);
    }
    
    // Provide real-time feedback if enabled
    if (feedbackLevel === 'real-time') {
      provideFeedback(question, { ...currentResponse });
    }
  };

  const updateResponse = (questionId, response) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  // Real-time feedback system
  const provideFeedback = (question, response) => {
    // This would provide color-coded hints about sentence placement
    // Green for strengthening, yellow for neutral, red for weakening
  };

  // Sentence ranking functionality
  const handleRankSentences = (questionId, rankings) => {
    const currentResponse = responses[questionId] || {};
    updateResponse(questionId, { ...currentResponse, rankings });
  };

  // Connector word selection
  const handleConnectorSelection = (questionId, connectorMap) => {
    const currentResponse = responses[questionId] || {};
    updateResponse(questionId, { ...currentResponse, connectors: connectorMap });
  };

  // Error identification and correction
  const handleErrorCorrection = (questionId, corrections) => {
    const currentResponse = responses[questionId] || {};
    updateResponse(questionId, { ...currentResponse, errorCorrections: corrections });
  };

  const finishQuiz = () => {
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
    const results = calculateResults();
    
    setShowResults(true);
    
    // Call completion callback
    setTimeout(() => {
      onQuizComplete({
        dotPointId,
        quizType: 'longResponse',
        score: results.percentage,
        totalQuestions: questions.length,
        correctAnswers: results.correct,
        timeSpent,
        passed: results.percentage >= 65
      });
    }, 3000);
  };

  const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      const response = responses[question.id];
      maxScore += 100; // Each question worth 100 points
      
      if (response) {
        totalScore += scoreQuestion(question, response);
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const correct = Math.round((totalScore / maxScore) * questions.length);
    
    return { percentage, correct, totalScore, maxScore };
  };

  const scoreQuestion = (question, response) => {
    let score = 0;
    
    if (question.type === 'argument-constructor') {
      const sentenceOrder = response.sentenceOrder || [];
      const expertOrder = question.expertResponse.structure;
      
      // Score based on sentence selection and ordering
      const strongSentences = question.sentences.filter(s => s.strength === 'strong').map(s => s.id);
      const usedStrong = sentenceOrder.filter(id => strongSentences.includes(id));
      
      score += (usedStrong.length / strongSentences.length) * 60; // 60 points for strong sentence selection
      
      // Order scoring (simplified)
      let orderScore = 0;
      for (let i = 0; i < Math.min(sentenceOrder.length, expertOrder.length); i++) {
        if (sentenceOrder[i] === expertOrder[i]) orderScore += 10;
      }
      score += orderScore; // Up to 40 points for correct ordering
    }
    
    return Math.min(100, score);
  };

  const renderQuestion = (question) => {
    const currentResponse = responses[question.id] || {};

    switch (question.type) {
      case 'argument-constructor':
        return renderArgumentConstructor(question, currentResponse);
      case 'hypothesis-to-conclusion':
        return renderHypothesisToConclusion(question, currentResponse);
      case 'compare-contrast-builder':
        return renderCompareContrastBuilder(question, currentResponse);
      case 'sentence-ranking':
        return (
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">
              Interactive sentence-ranking questions are coming soon.
            </p>
          </div>
        );
      case 'evidence-hierarchy':
        return renderEvidenceHierarchy(question, currentResponse);
      case 'mistake-correction':
        return (
          <div className="bg-white p-4 rounded border">
            <p className="text-sm text-gray-600">
              Error-identification practice is coming soon.
            </p>
          </div>
        );
      default:
        return <div>Question type not implemented</div>;
    }
  };

  const renderArgumentConstructor = (question, response) => {
    const availableSentences = question.sentences.filter(s => 
      !response.sentenceOrder?.includes(s.id)
    );
    const selectedSentences = (response.sentenceOrder || []).map(id => 
      question.sentences.find(s => s.id === id)
    ).filter(Boolean);

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Debate Topic</h3>
            </div>
            <p className="text-lg font-medium mb-2">{question.prompt}</p>
            <p className="text-sm text-blue-600">
              Position: <span className="font-semibold capitalize">{question.position}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available sentences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center">
                <span>Available Evidence</span>
                <span className="ml-2 text-sm text-gray-500">({availableSentences.length})</span>
              </h4>
              <Droppable droppableId="available-sentences">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {availableSentences.map((sentence, index) => (
                      <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white rounded border shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            } ${
                              sentence.strength === 'strong' ? 'border-green-200 bg-green-50' :
                              sentence.strength === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                              'border-red-200 bg-red-50'
                            }`}
                          >
                            <p className="text-sm">{sentence.text}</p>
                            {feedbackLevel === 'real-time' && (
                              <div className="flex items-center mt-2 text-xs">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  sentence.strength === 'strong' ? 'bg-green-400' :
                                  sentence.strength === 'medium' ? 'bg-yellow-400' :
                                  'bg-red-400'
                                }`} />
                                <span className="capitalize">{sentence.strength} evidence</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Argument construction area */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <span>Your Argument</span>
                <span className="ml-2 text-sm text-blue-600">({selectedSentences.length}/5 recommended)</span>
              </h4>
              <Droppable droppableId="selected-sentences">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-40">
                    {selectedSentences.map((sentence, index) => (
                      <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white rounded border shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <p className="text-sm flex-1">{sentence.text}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {selectedSentences.length === 0 && (
                      <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded">
                        Drag evidence sentences here to build your argument
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Expert comparison toggle */}
          {showExpertComparison && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Expert Response</h4>
              </div>
              <div className="space-y-2">
                {question.expertResponse.structure.map((sentenceId, index) => {
                  const sentence = question.sentences.find(s => s.id === sentenceId);
                  return (
                    <div key={sentenceId} className="flex items-start space-x-2 bg-white p-2 rounded">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <p className="text-sm">{sentence?.text}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-yellow-700 mt-3 italic">{question.expertResponse.reasoning}</p>
            </div>
          )}
        </div>
      </DragDropContext>
    );
  };

  const renderEvidenceHierarchy = (question, response) => {
    const assignments = response.assignments || {};
    const tierOptions = [
      {
        value: 'main-point',
        label: 'Main Points',
        description: 'Core ideas that anchor the response.',
        badgeClass: 'bg-blue-100 text-blue-800'
      },
      {
        value: 'supporting-evidence',
        label: 'Supporting Evidence',
        description: 'Data or conditions that strengthen main points.',
        badgeClass: 'bg-green-100 text-green-800'
      },
      {
        value: 'example',
        label: 'Specific Examples',
        description: 'Case studies or applications that illustrate ideas.',
        badgeClass: 'bg-purple-100 text-purple-800'
      },
      {
        value: 'irrelevant',
        label: 'Off-topic / Weak',
        description: 'Details that distract from the core argument.',
        badgeClass: 'bg-red-100 text-red-700'
      }
    ];

    const hierarchyStructure = question.hierarchyStructure || {};
    const handleAssignmentChange = (sentenceId, tier) => {
      const nextAssignments = { ...assignments };
      if (!tier) {
        delete nextAssignments[sentenceId];
      } else {
        nextAssignments[sentenceId] = tier;
      }
      updateResponse(question.id, { ...response, assignments: nextAssignments });
    };

    const sentencesByTier = tierOptions.reduce((acc, tier) => {
      acc[tier.value] = question.sentences.filter(
        (sentence) => assignments[sentence.id] === tier.value
      );
      return acc;
    }, {});

    const unassignedSentences = question.sentences.filter(
      (sentence) => !assignments[sentence.id]
    );

    const strengthBadge = (strength) => {
      switch (strength) {
        case 'strong':
          return 'bg-emerald-100 text-emerald-700';
        case 'medium':
          return 'bg-yellow-100 text-yellow-700';
        case 'weak':
          return 'bg-rose-100 text-rose-700';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-amber-500 mt-1" />
          <div className="space-y-1 text-sm text-amber-800">
            <p className="font-semibold">Build a layered response.</p>
            <p>
              Assign each sentence to the tier where it fits best. Aim for one or two main
              points, back them with strong evidence, and finish with specific examples.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {question.sentences.map((sentence) => {
            const selectedTier = assignments[sentence.id] || '';
            const expertTier = tierOptions.find((tier) => tier.value === sentence.tier);

            return (
              <div key={sentence.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <p className="text-sm text-gray-800">{sentence.text}</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${strengthBadge(
                      sentence.strength
                    )}`}
                  >
                    {sentence.strength ? sentence.strength.toUpperCase() : 'NEUTRAL'}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-start">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Placement
                    <select
                      className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={selectedTier}
                      onChange={(event) => handleAssignmentChange(sentence.id, event.target.value)}
                    >
                      <option value="">Not assigned yet</option>
                      {tierOptions.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {expertTier && (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${expertTier.badgeClass}`}
                    >
                      Expert tier: {expertTier.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Unassigned ({unassignedSentences.length})
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {unassignedSentences.length === 0 && (
                <li className="text-xs italic text-gray-400">All evidence placed.</li>
              )}
              {unassignedSentences.map((sentence) => (
                <li key={sentence.id}>{sentence.text}</li>
              ))}
            </ul>
          </div>

          {tierOptions.map((tier) => {
            const limit = hierarchyStructure[tier.value]?.maxItems;
            const items = sentencesByTier[tier.value] || [];

            return (
              <div key={tier.value} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-800">{tier.label}</h4>
                  <span className="text-xs text-gray-500">
                    {items.length}
                    {typeof limit === 'number' ? ` / ${limit}` : ''}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{tier.description}</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {items.length === 0 && (
                    <li className="text-xs italic text-gray-400">Nothing here yet.</li>
                  )}
                  {items.map((sentence) => (
                    <li key={sentence.id} className="flex items-start justify-between gap-2">
                      <span className="flex-1">{sentence.text}</span>
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => handleAssignmentChange(sentence.id, '')}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHypothesisToConclusion = (question, response) => {
    const availableSentences = question.sentences.filter(s => 
      !response.sentenceOrder?.includes(s.id) && s.category !== 'irrelevant'
    );
    const selectedSentences = (response.sentenceOrder || []).map(id => 
      question.sentences.find(s => s.id === id)
    ).filter(Boolean);

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {/* Experimental scenario */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">{question.scenario}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Setup:</strong> {question.experimentalData.setup}</p>
              <p><strong>Results:</strong> {question.experimentalData.results}</p>
              <div>
                <strong>Observations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {question.experimentalData.observations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available sentences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Available Statements</h4>
              <Droppable droppableId="available-sentences">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {availableSentences.map((sentence, index) => (
                      <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white rounded border shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            }`}
                          >
                            <p className="text-sm">{sentence.text}</p>
                            {feedbackLevel === 'real-time' && (
                              <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                                sentence.category === 'hypothesis' ? 'bg-purple-100 text-purple-800' :
                                sentence.category === 'observation' ? 'bg-blue-100 text-blue-800' :
                                sentence.category === 'analysis' ? 'bg-orange-100 text-orange-800' :
                                sentence.category === 'conclusion' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {sentence.category}
                              </span>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Scientific reasoning flow */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-3">Scientific Reasoning Flow</h4>
              <Droppable droppableId="reasoning-flow">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-40">
                    {selectedSentences.map((sentence, index) => (
                      <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white rounded border shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <p className="text-sm flex-1">{sentence.text}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {selectedSentences.length === 0 && (
                      <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded">
                        Drag statements here to build your scientific reasoning
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    );
  };

  const renderCompareContrastBuilder = (question, response) => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">{question.prompt}</h3>
            <p className="text-sm text-purple-600">
              Organize the sentences into appropriate categories to build a comprehensive comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Available sentences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Available Sentences</h4>
              <Droppable droppableId="available">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {question.sentences.filter(s => 
                      !Object.values(response).flat().includes(s.id)
                    ).map((sentence, index) => (
                      <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-white rounded border shadow-sm cursor-move transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                            } ${sentence.error ? 'border-red-200 bg-red-50' : ''}`}
                          >
                            <p className="text-sm">{sentence.text}</p>
                            {sentence.error && feedbackLevel === 'real-time' && (
                              <p className="text-xs text-red-600 mt-1"> {sentence.error}</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Category columns */}
            {Object.entries(question.categories).map(([categoryId, categoryName]) => (
              <div key={categoryId} className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-center">{categoryName}</h4>
                <Droppable droppableId={categoryId}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-32">
                      {(response[categoryId] || []).map((sentenceId, index) => {
                        const sentence = question.sentences.find(s => s.id === sentenceId);
                        return sentence ? (
                          <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-2 bg-gray-50 rounded border cursor-move transition-all ${
                                  snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                                }`}
                              >
                                <p className="text-sm">{sentence.text}</p>
                              </div>
                            )}
                          </Draggable>
                        ) : null;
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    );
  };

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading long response questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Long Response Questions Available</h2>
            <p className="text-gray-600 mb-6">
              Long response questions for this dot point are still being developed.
            </p>
            <button
              onClick={onBackToPathway}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Pathway
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToPathway}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Pathway</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Long Response Quiz</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            {timeRemaining !== null && (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className={`font-mono text-lg ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {renderQuestion(currentQuestion)}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowExpertComparison(!showExpertComparison)}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Star className="h-4 w-4" />
            <span>{showExpertComparison ? 'Hide' : 'Show'} Expert Comparison</span>
          </button>

          <div className="flex space-x-3">
            {currentQuestionIndex > 0 && (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={finishQuiz}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module5LongResponse;
