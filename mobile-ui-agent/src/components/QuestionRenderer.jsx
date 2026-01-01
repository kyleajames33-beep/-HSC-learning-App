import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const QuestionRenderer = ({ question, selectedAnswers, handleAnswerSelect, shuffledOptions }) => {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question.id, index)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                selectedAnswers[question.id] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>
      );

    case 'true-false':
      return (
        <div className="flex space-x-4 justify-center">
          {[true, false].map((option) => (
            <button
              key={option.toString()}
              onClick={() => handleAnswerSelect(question.id, option)}
              className={`px-8 py-4 rounded-lg border-2 font-semibold transition-all ${
                selectedAnswers[question.id] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {option ? 'TRUE' : 'FALSE'}
            </button>
          ))}
        </div>
      );

    case 'fill-blanks':
      return (
        <div className="space-y-4">
          {question.blanks.map((blank, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium">Blank {index + 1}:</span>
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:border-blue-500"
                placeholder="Enter answer..."
                onChange={(e) => {
                  const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                  newAnswers[index] = e.target.value;
                  handleAnswerSelect(question.id, newAnswers);
                }}
              />
            </div>
          ))}
        </div>
      );

    case 'match-definitions':
      return (
        <div className="space-y-4">
          {question.pairs.map((pair, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{pair.term}</span>
                <select
                  className="ml-4 p-2 border rounded focus:border-blue-500"
                  value={selectedAnswers[question.id]?.[index] || ''}
                  onChange={(e) => {
                    const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                    newAnswers[index] = e.target.value;
                    handleAnswerSelect(question.id, newAnswers);
                  }}
                >
                  <option value="">Select definition...</option>
                  {(shuffledOptions[question.id] || question.pairs.map(p => p.definition)).map((definition, defIndex) => (
                    <option key={defIndex} value={definition}>
                      {definition}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      );

    case 'multiple-select':
      return (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            Select all that apply:
          </div>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[question.id] && selectedAnswers[question.id].includes(index);
            return (
              <button
                key={index}
                onClick={() => {
                  const currentSelections = selectedAnswers[question.id] || [];
                  const newSelections = isSelected
                    ? currentSelections.filter(i => i !== index)
                    : [...currentSelections, index];
                  handleAnswerSelect(question.id, newSelections);
                }}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            );
          })}
        </div>
      );

    case 'drag-sequence': {
      const currentSequence = selectedAnswers[question.id] || question.items.map((item, index) => ({ ...item, id: index.toString() }));
      
      const handleDragEnd = (result) => {
        if (!result.destination) return;
        
        const items = Array.from(currentSequence);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        handleAnswerSelect(question.id, items);
      };

      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Drag and drop to arrange in the correct sequence:
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sequence">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {currentSequence.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 rounded-lg border-2 transition-all cursor-move ${
                            snapshot.isDragging
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="mr-3 text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM8 4h4v12H8V4z"/>
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900">{index + 1}.</span>
                            <span className="ml-2">{item.text}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      );

    }

    case 'image-hotspot': {
      const selectedSpots = selectedAnswers[question.id] || [];
      
      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Click on the correct part(s) of the diagram:
          </div>
          <div className="relative inline-block max-w-full">
            <img 
              src={question.imageUrl} 
              alt={question.imageAlt || 'Biological diagram'}
              className="max-w-full h-auto border rounded-lg"
              style={{ maxHeight: '400px' }}
            />
            {question.hotspots.map((hotspot, index) => {
              const isSelected = selectedSpots.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => {
                    const newSpots = question.multiSelect 
                      ? (isSelected 
                          ? selectedSpots.filter(i => i !== index)
                          : [...selectedSpots, index])
                      : [index];
                    handleAnswerSelect(question.id, newSpots);
                  }}
                  className={`absolute border-3 rounded-full transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-600 scale-110' 
                      : 'bg-red-500 border-red-600 hover:scale-105'
                  }`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: '20px',
                    height: '20px'
                  }}
                  title={hotspot.label}
                >
                  <span className="text-white text-xs font-bold">
                    {isSelected ? '' : index + 1}
                  </span>
                </button>
              );
            })}
          </div>
          {question.multiSelect && (
            <div className="text-xs text-gray-500">
              Multiple selections allowed - click to toggle
            </div>
          )}
        </div>
      );


    }

    case 'category-sort': {
      const sortedItems = selectedAnswers[question.id] || {};
      const unassignedItems = question.items.filter(item => 
        !Object.values(sortedItems).some(categoryItems => 
          categoryItems && categoryItems.some(sortedItem => sortedItem.id === item.id)
        )
      );

      const handleItemDrop = (item, categoryId) => {
        const newSortedItems = { ...sortedItems };
        
        // Remove item from any existing category
        Object.keys(newSortedItems).forEach(catId => {
          if (newSortedItems[catId]) {
            newSortedItems[catId] = newSortedItems[catId].filter(sortedItem => sortedItem.id !== item.id);
          }
        });
        
        // Add item to new category
        if (!newSortedItems[categoryId]) newSortedItems[categoryId] = [];
        newSortedItems[categoryId].push(item);
        
        handleAnswerSelect(question.id, newSortedItems);
      };

      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Drag items into the correct categories:
          </div>
          
          {/* Unassigned items pool */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Items to Sort:</h4>
            <div className="flex flex-wrap gap-2">
              {unassignedItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}
                  className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-all"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Category bins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.categories.map((category) => (
              <div
                key={category.id}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 min-h-32"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                  handleItemDrop(item, category.id);
                }}
              >
                <h4 className="font-semibold text-blue-800 mb-3">{category.name}</h4>
                <div className="space-y-2">
                  {(sortedItems[category.id] || []).map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}
                      className="px-3 py-2 bg-white border border-blue-300 rounded cursor-move hover:bg-blue-100 transition-all"
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
                {(!sortedItems[category.id] || sortedItems[category.id].length === 0) && (
                  <div className="text-blue-400 text-sm italic">Drop items here...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'timeline-builder': {
      const timelineEvents = selectedAnswers[question.id] || question.events.map((event, index) => ({ ...event, id: index.toString() }));
      
      const handleTimelineDragEnd = (result) => {
        if (!result.destination) return;
        
        const events = Array.from(timelineEvents);
        const [reorderedEvent] = events.splice(result.source.index, 1);
        events.splice(result.destination.index, 0, reorderedEvent);
        
        handleAnswerSelect(question.id, events);
      };

      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Arrange these events in chronological order (earliest to latest):
          </div>
          <DragDropContext onDragEnd={handleTimelineDragEnd}>
            <Droppable droppableId="timeline" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex space-x-4 overflow-x-auto pb-4">
                  {timelineEvents.map((event, index) => (
                    <Draggable key={event.id} draggableId={event.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`min-w-64 max-w-64 p-4 rounded-lg border-2 transition-all cursor-move flex-shrink-0 ${
                            snapshot.isDragging
                              ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                              : 'border-gray-300 bg-white hover:border-purple-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3 mx-auto">
                              {index + 1}
                            </div>
                            <div className="text-sm font-medium text-gray-900 leading-tight">
                              {event.text}
                            </div>
                            {event.timeframe && (
                              <div className="text-xs text-gray-500 mt-2">
                                {event.timeframe}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="text-xs text-gray-500 text-center">
            Drag cards left/right to reorder  Timeline flows from left to right
          </div>
        </div>
      );
    }

    case 'flowchart-complete': {
      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Complete the flowchart by filling in the missing steps:
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              {question.flowchartSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`p-4 rounded-lg border-2 text-center min-w-64 ${
                    step.type === 'fixed' 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {step.type === 'fixed' ? (
                      <span className="font-medium">{step.text}</span>
                    ) : (
                      <select
                        className="w-full p-2 border rounded focus:border-blue-500 bg-white"
                        value={selectedAnswers[question.id]?.[step.id] || ''}
                        onChange={(e) => {
                          const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                          newAnswers[step.id] = e.target.value;
                          handleAnswerSelect(question.id, newAnswers);
                        }}
                      >
                        <option value="">Select step...</option>
                        {(shuffledOptions[`${question.id}_${step.id}`] || step.options).map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {index < question.flowchartSteps.length - 1 && (
                    <div className="text-gray-400 text-2xl"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'graph-construct': {
      const plotPoints = selectedAnswers[question.id] || [];
      
      const handlePointClick = (x, y) => {
        const newPoints = [...plotPoints];
        const existingPointIndex = newPoints.findIndex(p => 
          Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5
        );
        
        if (existingPointIndex >= 0) {
          newPoints.splice(existingPointIndex, 1); // Remove point
        } else {
          newPoints.push({ x, y }); // Add point
        }
        
        handleAnswerSelect(question.id, newPoints);
      };

      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {question.graphType === 'plot' ? 'Click on the graph to plot data points:' : 'Select the correct graph:'}
          </div>
          
          {question.graphType === 'plot' ? (
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <svg 
                width="400" 
                height="300" 
                className="border border-gray-400"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - 50; // Account for margin
                  const y = rect.height - (e.clientY - rect.top) - 50; // Flip Y axis
                  handlePointClick(x, y);
                }}
              >
                {/* Axes */}
                <line x1="50" y1="250" x2="350" y2="250" stroke="black" strokeWidth="2" />
                <line x1="50" y1="50" x2="50" y2="250" stroke="black" strokeWidth="2" />
                
                {/* Axis labels */}
                <text x="200" y="280" textAnchor="middle" className="text-sm">
                  {question.xLabel}
                </text>
                <text x="25" y="150" textAnchor="middle" className="text-sm" transform="rotate(-90 25 150)">
                  {question.yLabel}
                </text>
                
                {/* Grid lines */}
                {[...Array(6)].map((_, i) => (
                  <g key={i}>
                    <line x1={50 + i * 50} y1="50" x2={50 + i * 50} y2="250" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1={50 + i * 33.33} x2="350" y2={50 + i * 33.33} stroke="#e5e7eb" strokeWidth="1" />
                  </g>
                ))}
                
                {/* Data points */}
                {plotPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={50 + point.x}
                    cy={250 - point.y}
                    r="4"
                    fill="blue"
                    className="cursor-pointer hover:fill-red-500"
                  />
                ))}
              </svg>
              <div className="text-xs text-gray-500 mt-2">
                Click to add points  Click existing points to remove them
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {question.graphOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, index)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedAnswers[question.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <img src={option.imageUrl} alt={option.description} className="w-full h-32 object-contain mb-2" />
                  <div className="text-sm font-medium">{option.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'slider-scale': {
      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Adjust the sliders to show the optimal values:
          </div>
          {question.variables.map((variable, index) => {
            const currentValue = selectedAnswers[question.id]?.[variable.id] || variable.defaultValue || variable.min;
            return (
              <div key={variable.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{variable.name}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {currentValue}{variable.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  step={variable.step || 1}
                  value={currentValue}
                  onChange={(e) => {
                    const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                    newAnswers[variable.id] = parseFloat(e.target.value);
                    handleAnswerSelect(question.id, newAnswers);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{variable.min}{variable.unit}</span>
                  <span>{variable.max}{variable.unit}</span>
                </div>
                {variable.description && (
                  <div className="text-sm text-gray-600 mt-2">{variable.description}</div>
                )}
              </div>
            );
          })}
        </div>
      );


    }

    case 'venn-diagram': {
      const vennSections = selectedAnswers[question.id] || {};
      
      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Drag items into the correct sections of the Venn diagram:
          </div>
          <div className="flex justify-center">
            <svg width="400" height="300" className="border border-gray-300 rounded-lg bg-white">
              {/* Circle A */}
              <circle cx="150" cy="150" r="80" fill="rgba(59, 130, 246, 0.3)" stroke="rgb(59, 130, 246)" strokeWidth="2" />
              {/* Circle B */}
              <circle cx="250" cy="150" r="80" fill="rgba(16, 185, 129, 0.3)" stroke="rgb(16, 185, 129)" strokeWidth="2" />
              
              {/* Labels */}
              <text x="120" y="100" textAnchor="middle" className="text-sm font-medium fill-blue-600">
                {question.circleA.name}
              </text>
              <text x="280" y="100" textAnchor="middle" className="text-sm font-medium fill-green-600">
                {question.circleB.name}
              </text>
              <text x="200" y="120" textAnchor="middle" className="text-xs font-medium fill-purple-600">
                Both
              </text>
            </svg>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">{question.circleA.name} Only</h4>
              <div 
                className="min-h-24 border-2 border-dashed border-blue-300 rounded p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                  const newVennSections = { ...vennSections };
                  newVennSections[item.id] = 'A';
                  handleAnswerSelect(question.id, newVennSections);
                }}
              >
                {question.items.filter(item => vennSections[item.id] === 'A').map(item => (
                  <div key={item.id} className="mb-1 p-2 bg-white rounded text-xs cursor-move" draggable
                       onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Both</h4>
              <div 
                className="min-h-24 border-2 border-dashed border-purple-300 rounded p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                  const newVennSections = { ...vennSections };
                  newVennSections[item.id] = 'AB';
                  handleAnswerSelect(question.id, newVennSections);
                }}
              >
                {question.items.filter(item => vennSections[item.id] === 'AB').map(item => (
                  <div key={item.id} className="mb-1 p-2 bg-white rounded text-xs cursor-move" draggable
                       onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">{question.circleB.name} Only</h4>
              <div 
                className="min-h-24 border-2 border-dashed border-green-300 rounded p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                  const newVennSections = { ...vennSections };
                  newVennSections[item.id] = 'B';
                  handleAnswerSelect(question.id, newVennSections);
                }}
              >
                {question.items.filter(item => vennSections[item.id] === 'B').map(item => (
                  <div key={item.id} className="mb-1 p-2 bg-white rounded text-xs cursor-move" draggable
                       onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Unassigned items */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Items to Sort:</h4>
            <div className="flex flex-wrap gap-2">
              {question.items.filter(item => !vennSections[item.id]).map(item => (
                <div key={item.id} className="p-2 bg-white rounded border cursor-move" draggable
                     onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(item))}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'virtual-microscope': {
      const zoom = selectedAnswers[question.id]?.zoom || 1;
      const identifiedStructures = selectedAnswers[question.id]?.structures || [];
      
      return (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Use the virtual microscope to identify the biological structures:
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="bg-black rounded-lg p-4 relative">
              <div 
                className="relative overflow-hidden rounded-lg bg-white"
                style={{ height: '300px' }}
              >
                <img 
                  src={question.imageUrl} 
                  alt="Microscope view"
                  className="absolute transition-transform duration-300 cursor-crosshair"
                  style={{ 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onClick={(e) => {
                    if (question.clickableStructures) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      
                      // Find clicked structure
                      const clickedStructure = question.clickableStructures.find(structure => 
                        Math.abs(structure.x - x) < 5 && Math.abs(structure.y - y) < 5
                      );
                      
                      if (clickedStructure) {
                        const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                        const newStructures = [...identifiedStructures];
                        
                        if (!newStructures.find(s => s.id === clickedStructure.id)) {
                          newStructures.push(clickedStructure);
                        }
                        
                        newAnswers.structures = newStructures;
                        handleAnswerSelect(question.id, newAnswers);
                      }
                    }
                  }}
                />
                
                {/* Overlay identified structures */}
                {identifiedStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${structure.x}%`,
                      top: `${structure.y}%`
                    }}
                  >
                    
                  </div>
                ))}
              </div>
              
              {/* Microscope controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">Zoom:</span>
                  <div className="flex space-x-2">
                    {[1, 2, 4, 8].map((zoomLevel) => (
                      <button
                        key={zoomLevel}
                        onClick={() => {
                          const newAnswers = { ...(selectedAnswers[question.id] || {}) };
                          newAnswers.zoom = zoomLevel;
                          handleAnswerSelect(question.id, newAnswers);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          zoom === zoomLevel
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        }`}
                      >
                        {zoomLevel}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-white text-sm">
                  Identified: {identifiedStructures.length} / {question.targetCount || '?'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Structure checklist */}
          {question.structureList && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Identify these structures:</h4>
              <div className="grid grid-cols-2 gap-2">
                {question.structureList.map((structure) => (
                  <div 
                    key={structure.id}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      identifiedStructures.find(s => s.id === structure.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      identifiedStructures.find(s => s.id === structure.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {identifiedStructures.find(s => s.id === structure.id) && (
                        <span className="text-white text-xs"></span>
                      )}
                    </div>
                    <span className="text-sm">{structure.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    default:
      return <div className="text-gray-500">Question type &quot;{question.type}&quot; not supported yet</div>;
  }
};

export default QuestionRenderer;
