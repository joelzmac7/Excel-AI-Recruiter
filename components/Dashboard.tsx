import React, { useState } from 'react';
import { PipelineMetrics, CoachingNudge } from '../types';

interface DashboardProps {
    metrics: PipelineMetrics;
    setPipelineMetrics: (metrics: PipelineMetrics) => void;
    nudges: CoachingNudge[];
}

type TimeFilter = 'day' | 'week' | 'month';

const MetricCard: React.FC<{
    title: string;
    current: number;
    goal: number;
    icon: string;
    color: string;
    onIncrement: () => void;
    onDecrement: () => void;
}> = ({ title, current, goal, icon, color, onIncrement, onDecrement }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isOnTrack = percentage >= 80;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${color}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onDecrement}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={current <= 0}
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7-7m0 0l-7 7m7-7v18" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{current}</div>
                        <div className="text-sm text-gray-500">of {goal}</div>
                    </div>
                    <button
                        onClick={onIncrement}
                        className="p-1 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
                    >
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                        isOnTrack ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
                <span>{percentage.toFixed(0)}% complete</span>
                <span className={isOnTrack ? 'text-green-600' : 'text-red-600'}>
                    {isOnTrack ? 'On Track' : 'Behind'}
                </span>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ metrics, setPipelineMetrics, nudges }) => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
    const activeNudges = nudges.filter(n => !n.dismissed);

    const handleMetricChange = (metricKey: keyof PipelineMetrics, increment: boolean) => {
        setPipelineMetrics({
            ...metrics,
            [metricKey]: {
                ...metrics[metricKey],
                current: Math.max(0, metrics[metricKey].current + (increment ? 1 : -1))
            }
        });
    };

    const metricCards = [
        {
            title: 'TOAs',
            current: metrics.toas.current,
            goal: metrics.toas.goal,
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'bg-blue-500',
            key: 'toas' as keyof PipelineMetrics
        },
        {
            title: 'Submissions',
            current: metrics.submissions.current,
            goal: metrics.submissions.goal,
            icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'bg-green-500',
            key: 'submissions' as keyof PipelineMetrics
        },
        {
            title: 'Booked Candidates',
            current: metrics.bookedCandidates.current,
            goal: metrics.bookedCandidates.goal,
            icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0V6a2 2 0 012-2h4a2 2 0 012 2v1',
            color: 'bg-purple-500',
            key: 'bookedCandidates' as keyof PipelineMetrics
        },
        {
            title: 'Pipeline Count',
            current: metrics.pipelineCount.current,
            goal: metrics.pipelineCount.goal,
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            color: 'bg-indigo-500',
            key: 'pipelineCount' as keyof PipelineMetrics
        },
        {
            title: 'Calls',
            current: metrics.calls.current,
            goal: metrics.calls.goal,
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
            color: 'bg-orange-500',
            key: 'calls' as keyof PipelineMetrics
        },
        {
            title: 'Texts',
            current: metrics.texts.current,
            goal: metrics.texts.goal,
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            color: 'bg-pink-500',
            key: 'texts' as keyof PipelineMetrics
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header with Time Filter */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pipeline Dashboard</h1>
                    <p className="text-gray-600">Track your recruiting metrics and performance</p>
                </div>
                
                <div className="flex items-center space-x-2">
                    {(['day', 'week', 'month'] as TimeFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                timeFilter === filter
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Nudges */}
            {activeNudges.length > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">AI Coaching Insights</h2>
                    </div>
                    
                    <div className="space-y-3">
                        {activeNudges.slice(0, 3).map((nudge) => (
                            <div key={nudge.id} className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{nudge.message}</p>
                                    {nudge.actionable && nudge.action && (
                                        <button className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
                                            {nudge.action} →
                                        </button>
                                    )}
                                </div>
                                <button className="ml-4 text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metricCards.map((metric) => (
                    <MetricCard 
                        key={metric.key} 
                        {...metric} 
                        onIncrement={() => handleMetricChange(metric.key, true)}
                        onDecrement={() => handleMetricChange(metric.key, false)}
                    />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">AI Assistant</div>
                            <div className="text-sm text-gray-500">Get help with tasks</div>
                        </div>
                    </button>
                    
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1h-1v9a3 3 0 01-3 3H8a3 3 0 01-3-3V7H4a1 1 0 01-1-1V5a1 1 0 011-1h3z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Social Media</div>
                            <div className="text-sm text-gray-500">Generate job posts</div>
                        </div>
                    </button>
                    
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">View Reports</div>
                            <div className="text-sm text-gray-500">Weekly scorecard</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;