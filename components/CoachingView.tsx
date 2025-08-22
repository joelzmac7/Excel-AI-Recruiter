import React, { useState } from 'react';
import { CoachingNudge, RecruiterInfo } from '../types';

interface CoachingViewProps {
    nudges: CoachingNudge[];
    setNudges: (nudges: CoachingNudge[]) => void;
    recruiterInfo: RecruiterInfo;
}

const nudgeTypeColors = {
    performance: 'bg-blue-100 text-blue-800 border-blue-200',
    reminder: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    suggestion: 'bg-green-100 text-green-800 border-green-200',
    celebration: 'bg-purple-100 text-purple-800 border-purple-200'
};

const nudgeIcons = {
    performance: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    reminder: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    suggestion: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    celebration: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
};

const NudgeCard: React.FC<{
    nudge: CoachingNudge;
    onDismiss: (id: string) => void;
    onAction: (nudge: CoachingNudge) => void;
}> = ({ nudge, onDismiss, onAction }) => {
    return (
        <div className={`p-6 rounded-xl shadow-sm border-2 ${nudgeTypeColors[nudge.type]} transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${nudge.type === 'performance' ? 'bg-blue-200' : 
                        nudge.type === 'reminder' ? 'bg-yellow-200' : 
                        nudge.type === 'suggestion' ? 'bg-green-200' : 'bg-purple-200'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={nudgeIcons[nudge.type]} />
                        </svg>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                        {nudge.type}
                    </span>
                </div>
                
                <button
                    onClick={() => onDismiss(nudge.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{nudge.message}</p>

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {new Date(nudge.createdAt).toLocaleDateString()}
                </span>
                
                {nudge.actionable && nudge.action && (
                    <button
                        onClick={() => onAction(nudge)}
                        className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-md text-sm font-medium transition-all shadow-sm"
                    >
                        {nudge.action}
                    </button>
                )}
            </div>
        </div>
    );
};

const WeeklyScorecard: React.FC<{ recruiterInfo: RecruiterInfo }> = ({ recruiterInfo }) => {
    const mockScorecard = {
        weekOf: new Date().toISOString().split('T')[0],
        performance: {
            callsPerDay: 45,
            submissionRate: 12,
            responseRate: 68,
            pipelineGrowth: 15
        },
        insights: [
            "Your call volume is 23% higher than last week - excellent momentum!",
            "Response rate improved significantly after implementing personalized messaging",
            "Pipeline growth is steady, consider focusing on higher-value opportunities"
        ],
        recommendations: [
            "Schedule follow-ups for candidates who haven't responded in 3+ days",
            "Focus on ICU and OR specialties - they're showing higher placement rates",
            "Consider batch-processing similar tasks to improve efficiency"
        ]
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Weekly AI Scorecard</h2>
                    <p className="text-sm text-gray-600">Week of {new Date(mockScorecard.weekOf).toLocaleDateString()}</p>
                </div>
                <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors">
                    Email Report
                </button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{mockScorecard.performance.callsPerDay}</div>
                    <div className="text-sm text-gray-600">Calls/Day</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{mockScorecard.performance.submissionRate}</div>
                    <div className="text-sm text-gray-600">Submissions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mockScorecard.performance.responseRate}%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">+{mockScorecard.performance.pipelineGrowth}</div>
                    <div className="text-sm text-gray-600">Pipeline Growth</div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h3>
                <div className="space-y-2">
                    {mockScorecard.insights.map((insight, index) => (
                        <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{insight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="space-y-2">
                    {mockScorecard.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CoachingView: React.FC<CoachingViewProps> = ({ nudges, setNudges, recruiterInfo }) => {
    const [filter, setFilter] = useState<'all' | CoachingNudge['type']>('all');

    const filteredNudges = nudges.filter(nudge => {
        if (filter === 'all') return !nudge.dismissed;
        return nudge.type === filter && !nudge.dismissed;
    });

    const handleDismissNudge = (id: string) => {
        setNudges(nudges.map(nudge => 
            nudge.id === id ? { ...nudge, dismissed: true } : nudge
        ));
    };

    const handleNudgeAction = (nudge: CoachingNudge) => {
        // In a real implementation, this would trigger the specific action
        alert(`Action triggered: ${nudge.action}`);
        handleDismissNudge(nudge.id);
    };

    const activeNudges = nudges.filter(n => !n.dismissed);
    const nudgesByType = {
        performance: activeNudges.filter(n => n.type === 'performance').length,
        reminder: activeNudges.filter(n => n.type === 'reminder').length,
        suggestion: activeNudges.filter(n => n.type === 'suggestion').length,
        celebration: activeNudges.filter(n => n.type === 'celebration').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Coaching</h1>
                <p className="text-gray-600">Personalized insights and recommendations to boost your performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{nudgesByType.performance}</div>
                    <div className="text-sm text-gray-600">Performance Insights</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{nudgesByType.reminder}</div>
                    <div className="text-sm text-gray-600">Reminders</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{nudgesByType.suggestion}</div>
                    <div className="text-sm text-gray-600">Suggestions</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">{nudgesByType.celebration}</div>
                    <div className="text-sm text-gray-600">Celebrations</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {(['all', 'performance', 'reminder', 'suggestion', 'celebration'] as const).map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === filterOption
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                ))}
            </div>

            {/* Weekly Scorecard */}
            <WeeklyScorecard recruiterInfo={recruiterInfo} />

            {/* Nudges */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Coaching Nudges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredNudges.map((nudge) => (
                        <NudgeCard
                            key={nudge.id}
                            nudge={nudge}
                            onDismiss={handleDismissNudge}
                            onAction={handleNudgeAction}
                        />
                    ))}
                </div>

                {filteredNudges.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No active nudges</h3>
                        <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for new insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachingView;