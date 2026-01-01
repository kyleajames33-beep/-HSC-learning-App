import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PathVisualizer from './PathVisualizer';
import miniBossConfig from '../data/miniBossConfig.json';
import bossConfig from '../data/bossConfig.json';

/**
 * RoadmapPathway - Visual journey showing dotpoints connected by a path
 *
 * Features:
 * - Displays all dotpoints, Mini Bosses, and Boss Battle as connected journey
 * - Visual path with animations
 * - Locked/unlocked states
 * - Click to navigate to dotpoint or battle
 */

const RoadmapPathway = ({
  subject,
  moduleId,
  pathwayData,
  progressHook,
  onNavigate,
  onBack,
  onViewToggle
}) => {
  const scrollContainerRef = useRef(null);
  const [nodes, setNodes] = useState([]);

  const {
    pathwayProgress,
    getDotPointStatus,
    isContentAccessible
  } = progressHook();

  const config = {
    biology: {
      icon: '🧬',
      title: 'Biology',
      gradient: 'from-green-500 to-blue-500'
    },
    chemistry: {
      icon: '⚗️',
      title: 'Chemistry',
      gradient: 'from-purple-500 to-indigo-500'
    }
  };

  const subjectConfig = config[subject] || config.biology;

  // Build nodes array from pathway data
  useEffect(() => {
    if (!pathwayData || !pathwayData.inquiryQuestions) return;

    const nodeList = [];

    // Iterate through inquiry questions
    Object.entries(pathwayData.inquiryQuestions).forEach(([iqId, iq], iqIndex) => {
      // Add dotpoints for this IQ
      Object.entries(iq.dotPoints).forEach(([dotPointId, dotPoint]) => {
        const status = getDotPointStatus(dotPointId);
        const accessible = isContentAccessible(dotPointId);

        nodeList.push({
          id: dotPointId,
          type: 'dotpoint',
          label: dotPointId,
          icon: status.icon || '📚',
          status: accessible ? (status.status === 'completed' ? 'completed' : 'available') : 'locked',
          progress: status.progress || 0,
          data: dotPoint
        });
      });

      // Add Mini Boss after this IQ's dotpoints
      const miniBossId = `${subject === 'biology' ? 'bio' : subject}-m${moduleId}-${iqId.toLowerCase()}`;
      const miniBoss = getMiniBossConfig(miniBossId);

      if (miniBoss) {
        // Check if Mini Boss is unlocked
        const allDotpointsComplete = Object.keys(iq.dotPoints).every(dpId => {
          const dpStatus = getDotPointStatus(dpId);
          return dpStatus.status === 'completed';
        });

        nodeList.push({
          id: miniBossId,
          type: 'mini-boss',
          label: miniBoss.name,
          icon: miniBoss.sprite,
          status: 'available', // FORCE AVAILABLE FOR TESTING
          progress: 0,
          data: miniBoss
        });
      }
    });

    // Add Boss Battle at the end
    const bossId = `${subject === 'biology' ? 'bio' : subject}-m${moduleId}`;
    const boss = getBossConfig(bossId);

    if (boss) {
      // Check if all Mini Bosses are defeated
      const allMiniBossesDefeated = checkAllMiniBossesDefeated();

      nodeList.push({
        id: bossId,
        type: 'boss',
        label: boss.name,
        icon: boss.sprite,
        status: 'available', // FORCE AVAILABLE FOR TESTING
        progress: 0,
        data: boss
      });
    }

    setNodes(nodeList);
  }, [pathwayData, pathwayProgress, subject, moduleId]);

  const getMiniBossConfig = (miniBossId) => {
    try {
      const subjectMiniBosses = miniBossConfig[subject];
      if (!subjectMiniBosses) return null;

      const moduleMiniBosses = subjectMiniBosses[`module${moduleId}`];
      if (!moduleMiniBosses) return null;

      return moduleMiniBosses[miniBossId];
    } catch (error) {
      console.error('Error getting mini boss config:', error, 'for ID:', miniBossId);
      return null;
    }
  };

  const getBossConfig = (bossId) => {
    try {
      const subjectBosses = bossConfig[subject];
      if (!subjectBosses) {
        console.error('No boss config for subject:', subject);
        return null;
      }

      const boss = subjectBosses[bossId];
      if (!boss) {
        console.error('No boss config for ID:', bossId, 'Available:', Object.keys(subjectBosses));
      }
      return boss;
    } catch (error) {
      console.error('Error getting boss config:', error, 'for ID:', bossId);
      return null;
    }
  };

  const checkAllMiniBossesDefeated = () => {
    try {
      // Get battle progress from localStorage
      const storageKey = `battle-progress-${subject}-${moduleId}`;
      const saved = localStorage.getItem(storageKey);
      if (!saved) return false;

      const battleProgress = JSON.parse(saved);
      const subjectPrefix = subject === 'biology' ? 'bio' : subject;
      const requiredMiniBosses = [`${subjectPrefix}-m${moduleId}-iq1`, `${subjectPrefix}-m${moduleId}-iq2`, `${subjectPrefix}-m${moduleId}-iq3`, `${subjectPrefix}-m${moduleId}-iq4`];
      
      // Add IQ5 for biology module 5
      if (subject === 'biology' && moduleId === '5') {
        requiredMiniBosses.push(`${subjectPrefix}-m${moduleId}-iq5`);
      }

      // Check if all required mini bosses are defeated
      return requiredMiniBosses.every(miniBossId => 
        battleProgress.miniBossesDefeated.includes(miniBossId)
      );
    } catch (error) {
      console.error('Error checking mini boss progress:', error);
      return false;
    }
  };

  const handleNodeClick = (node) => {
    if (node.status === 'locked') {
      // Show locked message
      return;
    }

    // Navigate based on node type
    if (node.type === 'dotpoint') {
      onNavigate && onNavigate('dotpoint-detail', node.id);
    } else if (node.type === 'mini-boss') {
      onNavigate && onNavigate('mini-boss', node.id);
    } else if (node.type === 'boss') {
      onNavigate && onNavigate('boss-battle', node.id);
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (nodes.length === 0) return 0;

    const completedNodes = nodes.filter(n => n.status === 'completed').length;
    return Math.round((completedNodes / nodes.length) * 100);
  };

  const overallProgress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${subjectConfig.gradient} rounded-full flex items-center justify-center text-white text-2xl`}>
                {subjectConfig.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pathwayData.name}</h1>
                <p className="text-xs text-gray-600">Learning Journey</p>
              </div>
            </div>

            {/* View Toggle Button */}
            {onViewToggle && (
              <button
                onClick={onViewToggle}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Switch to Grid View"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${subjectConfig.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-1">
            {overallProgress}% Complete
          </div>
        </div>
      </div>

      {/* Pathway */}
      <div
        ref={scrollContainerRef}
        className="px-4 py-8 overflow-y-auto"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <div className="max-w-md mx-auto">
          {nodes.length > 0 ? (
            <PathVisualizer
              nodes={nodes}
              subject={subject}
              viewportWidth={400}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading pathway...</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 max-w-md mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Legend</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-gray-700">Locked</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{nodes.find(n => n.type === 'mini-boss')?.icon || '⚔️'}</span>
              <span className="text-gray-700">Mini Boss</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{nodes.find(n => n.type === 'boss')?.icon || '🐉'}</span>
              <span className="text-gray-700">Boss Battle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPathway;
