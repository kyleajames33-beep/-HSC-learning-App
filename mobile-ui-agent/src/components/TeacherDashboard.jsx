import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onBack }) => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');
  const [classData, setClassData] = useState({});
  const [loading, setLoading] = useState(true);

  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'bio12a', name: 'Biology 12A' },
    { id: 'bio12b', name: 'Biology 12B' },
    { id: 'bio11a', name: 'Biology 11A' }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  useEffect(() => {
    loadClassData();
  }, [selectedClass, selectedTimeRange]);

  const loadClassData = async () => {
    setLoading(true);
    
    try {
      const mockClassData = generateMockClassData();
      setClassData(mockClassData);
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockClassData = () => {
    const studentCount = selectedClass === 'all' ? 120 : 30;
    const students = [];
    
    for (let i = 1; i <= studentCount; i++) {
      students.push({
        id: `student_${i}`,
        name: `Student ${i}`,
        class: selectedClass === 'all' ? classes[Math.floor(Math.random() * (classes.length - 1)) + 1].name : classes.find(c => c.id === selectedClass)?.name,
        averageScore: Math.floor(Math.random() * 40) + 60,
        questionsCompleted: Math.floor(Math.random() * 200) + 50,
        timeSpent: Math.floor(Math.random() * 1000) + 300,
        streakDays: Math.floor(Math.random() * 15),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        strengths: generateRandomTopics(2),
        weaknesses: generateRandomTopics(2),
        masteryLevels: generateMasteryLevels()
      });
    }

    const dotPoints = ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ4.1', 'IQ4.2', 'IQ5.1', 'IQ5.2'];
    
    const classPerformance = dotPoints.map(dp => ({
      dotPoint: dp,
      averageScore: Math.floor(Math.random() * 30) + 65,
      completionRate: Math.floor(Math.random() * 40) + 60,
      difficulty: Math.random() * 0.4 + 0.3,
      timeSpent: Math.floor(Math.random() * 30) + 20
    }));

    const engagementData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      engagementData.push({
        date: date.toISOString().split('T')[0],
        activeStudents: Math.floor(Math.random() * 15) + 15,
        questionsAnswered: Math.floor(Math.random() * 200) + 100,
        averageTime: Math.floor(Math.random() * 20) + 25
      });
    }

    const difficultyBreakdown = [
      { difficulty: 'Easy', attempted: Math.floor(Math.random() * 500) + 300, correct: 0.85 },
      { difficulty: 'Medium', attempted: Math.floor(Math.random() * 400) + 250, correct: 0.72 },
      { difficulty: 'Hard', attempted: Math.floor(Math.random() * 200) + 100, correct: 0.58 }
    ];

    return {
      students,
      classPerformance,
      engagementData,
      difficultyBreakdown,
      summary: {
        totalStudents: studentCount,
        activeToday: Math.floor(studentCount * 0.7),
        averageScore: Math.floor(Math.random() * 20) + 75,
        completionRate: Math.floor(Math.random() * 20) + 78,
        totalQuestionsAnswered: Math.floor(Math.random() * 5000) + 10000,
        averageStudyTime: Math.floor(Math.random() * 30) + 35
      }
    };
  };

  const generateRandomTopics = (count) => {
    const topics = ['Cell Division', 'DNA Replication', 'Protein Synthesis', 'Photosynthesis', 'Cellular Respiration', 'Genetics', 'Evolution'];
    const selected = [];
    while (selected.length < count && selected.length < topics.length) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      if (!selected.includes(topic)) selected.push(topic);
    }
    return selected;
  };

  const generateMasteryLevels = () => {
    return {
      novice: Math.floor(Math.random() * 3),
      developing: Math.floor(Math.random() * 4) + 2,
      competent: Math.floor(Math.random() * 4) + 3,
      proficient: Math.floor(Math.random() * 3) + 2,
      expert: Math.floor(Math.random() * 2) + 1
    };
  };

  const getAtRiskStudents = () => {
    return classData.students?.filter(student => 
      student.averageScore < 65 || 
      student.streakDays === 0 || 
      (Date.now() - student.lastActive.getTime()) > (3 * 24 * 60 * 60 * 1000)
    ) || [];
  };

  const getTopPerformers = () => {
    return classData.students?.filter(student => 
      student.averageScore >= 85 && student.streakDays >= 5
    ).sort((a, b) => b.averageScore - a.averageScore).slice(0, 5) || [];
  };

  const getEngagementTrends = () => {
    if (!classData.engagementData) return { trend: 'stable', change: 0 };
    
    const recent = classData.engagementData.slice(-3);
    const earlier = classData.engagementData.slice(0, 3);
    
    const recentAvg = recent.reduce((sum, day) => sum + day.activeStudents, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, day) => sum + day.activeStudents, 0) / earlier.length;
    
    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    
    let trend = 'stable';
    if (change > 10) trend = 'increasing';
    else if (change < -10) trend = 'decreasing';
    
    return { trend, change: Math.round(change) };
  };

  if (loading) {
    return (
      <div className="teacher-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading class analytics...</p>
      </div>
    );
  }

  const atRiskStudents = getAtRiskStudents();
  const topPerformers = getTopPerformers();
  const engagementTrends = getEngagementTrends();

  return (
    <div className="teacher-dashboard">
      <header className="teacher-header">
        <div className="header-top">
          <button onClick={onBack} className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Teacher Dashboard</h1>
          <div className="header-actions">
            <button className="export-button">
              Export Data
            </button>
          </div>
        </div>
        
        <div className="dashboard-controls">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-select"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="term">This Term</option>
          </select>
          
          <div className="view-tabs">
            {['overview', 'performance', 'engagement', 'individual'].map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`tab ${selectedView === view ? 'active' : ''}`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {selectedView === 'overview' && (
          <div className="overview-grid">
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-icon"></div>
                <div className="card-content">
                  <h3>{classData.summary?.totalStudents || 0}</h3>
                  <p>Total Students</p>
                  <span className="card-subtitle">
                    {classData.summary?.activeToday || 0} active today
                  </span>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="card-icon"></div>
                <div className="card-content">
                  <h3>{classData.summary?.averageScore || 0}%</h3>
                  <p>Class Average</p>
                  <span className="card-subtitle">
                    {engagementTrends.change >= 0 ? '+' : ''}{engagementTrends.change}% vs last period
                  </span>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="card-icon"></div>
                <div className="card-content">
                  <h3>{classData.summary?.completionRate || 0}%</h3>
                  <p>Completion Rate</p>
                  <span className="card-subtitle">
                    {classData.summary?.totalQuestionsAnswered || 0} questions total
                  </span>
                </div>
              </div>
              
              <div className="summary-card">
                <div className="card-icon"></div>
                <div className="card-content">
                  <h3>{classData.summary?.averageStudyTime || 0}min</h3>
                  <p>Avg Study Time</p>
                  <span className="card-subtitle">
                    Per student per day
                  </span>
                </div>
              </div>
            </div>

            <div className="overview-charts">
              <div className="chart-container">
                <h3>Class Performance by Topic</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classData.classPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dotPoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Weekly Engagement Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={classData.engagementData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeStudents" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="student-lists">
              <div className="at-risk-students">
                <h3>At-Risk Students ({atRiskStudents.length})</h3>
                <div className="student-list">
                  {atRiskStudents.slice(0, 5).map(student => (
                    <div key={student.id} className="student-item risk">
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-score">{student.averageScore}%</span>
                      </div>
                      <div className="student-issues">
                        {student.averageScore < 65 && <span className="issue">Low Score</span>}
                        {student.streakDays === 0 && <span className="issue">No Streak</span>}
                        {(Date.now() - student.lastActive.getTime()) > (3 * 24 * 60 * 60 * 1000) && 
                          <span className="issue">Inactive</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="top-performers">
                <h3>Top Performers ({topPerformers.length})</h3>
                <div className="student-list">
                  {topPerformers.map((student, index) => (
                    <div key={student.id} className="student-item top">
                      <div className="student-rank">#{index + 1}</div>
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-score">{student.averageScore}%</span>
                      </div>
                      <div className="student-streak">
                         {student.streakDays} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="performance-view">
            <div className="chart-container">
              <h3>Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { range: '90-100%', count: classData.students?.filter(s => s.averageScore >= 90).length || 0 },
                  { range: '80-89%', count: classData.students?.filter(s => s.averageScore >= 80 && s.averageScore < 90).length || 0 },
                  { range: '70-79%', count: classData.students?.filter(s => s.averageScore >= 70 && s.averageScore < 80).length || 0 },
                  { range: '60-69%', count: classData.students?.filter(s => s.averageScore >= 60 && s.averageScore < 70).length || 0 },
                  { range: '50-59%', count: classData.students?.filter(s => s.averageScore >= 50 && s.averageScore < 60).length || 0 },
                  { range: '<50%', count: classData.students?.filter(s => s.averageScore < 50).length || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Performance by Difficulty</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classData.difficultyBreakdown?.map(item => ({
                  ...item,
                  correctPercent: Math.round(item.correct * 100)
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="correctPercent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'engagement' && (
          <div className="engagement-view">
            <div className="chart-container">
              <h3>Daily Active Students</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={classData.engagementData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="activeStudents" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Questions Answered Per Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classData.engagementData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questionsAnswered" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="engagement-metrics">
              <div className="metric-card">
                <h4>Engagement Trend</h4>
                <div className={`trend-indicator ${engagementTrends.trend}`}>
                  {engagementTrends.trend === 'increasing' ? '' : 
                   engagementTrends.trend === 'decreasing' ? '' : ''}
                  <span>{engagementTrends.trend.toUpperCase()}</span>
                </div>
                <p>{Math.abs(engagementTrends.change)}% change from previous period</p>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'individual' && (
          <div className="individual-view">
            <div className="student-grid">
              {(classData.students || []).map(student => (
                <div key={student.id} className="individual-student-card">
                  <div className="student-header">
                    <h4>{student.name}</h4>
                    <span className="student-class">{student.class}</span>
                  </div>
                  
                  <div className="student-metrics">
                    <div className="metric">
                      <span className="metric-label">Average Score</span>
                      <span className={`metric-value ${student.averageScore >= 75 ? 'good' : student.averageScore >= 60 ? 'fair' : 'poor'}`}>
                        {student.averageScore}%
                      </span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Questions Completed</span>
                      <span className="metric-value">{student.questionsCompleted}</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Study Streak</span>
                      <span className="metric-value">{student.streakDays} days</span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Total Time</span>
                      <span className="metric-value">{Math.floor(student.timeSpent / 60)}h {student.timeSpent % 60}m</span>
                    </div>
                  </div>
                  
                  <div className="student-topics">
                    <div className="strengths">
                      <strong>Strengths:</strong>
                      <div className="topic-list">
                        {student.strengths.map(topic => (
                          <span key={topic} className="topic strength">{topic}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="weaknesses">
                      <strong>Areas for improvement:</strong>
                      <div className="topic-list">
                        {student.weaknesses.map(topic => (
                          <span key={topic} className="topic weakness">{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="last-active">
                    Last active: {student.lastActive.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
