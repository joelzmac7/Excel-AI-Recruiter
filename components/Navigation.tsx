import React from 'react';
import { AppView, RecruiterInfo, NavigationItem } from '../types';

interface NavigationProps {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    recruiterInfo: RecruiterInfo;
    onClose?: () => void;
}

const navigationItems: NavigationItem[] = [
    { 
        id: 'dashboard', 
        label: 'Recruiter Command Center', 
        icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z', 
        phase: 1,
        description: 'TOAs, Submissions, Booked, Pipeline Count, Calls, SMS - Goal vs Actual'
    },
    { 
        id: 'candidates',
        label: 'Candidate Bookmarks', 
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
        phase: 1,
        description: 'Name, specialty, tags, ATS URL capture, readiness scores 0-100'
    },
    { 
        id: 'todos', 
        label: 'To-Dos & EOS/90', 
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', 
        phase: 1,
        description: 'Assign, due dates, Teams/Outlook reminders, "Mine" vs "Assigned to me"'
    },
    { 
        id: 'issues', 
        label: 'Issues (IDS)', 
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z', 
        phase: 1,
        description: 'Tags (Compliance, Pay, Client), states (Open, Discussed, Resolved)'
    },
    { 
        id: 'social', 
        label: 'Text AI Assistant', 
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', 
        phase: 1,
        description: 'Draft SMS/email/social copy, [Copy], [Open in Sense], [Open in Outlook]'
    },
    { 
        id: 'learning', 
        label: 'Learning Center', 
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', 
        phase: 3,
        description: 'Record workflows, auto-generate guides with screenshots + transcript'
    },
    { 
        id: 'coaching', 
        label: 'AI Coach & Voice', 
        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', 
        phase: 3,
        description: 'Voice mode (ASR→NLU), coaching nudges, contract-ending alerts'
    },
    { 
        id: 'integrations', 
        label: 'Integrations', 
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', 
        phase: 1,
        description: 'Nexus, Sense, RingCentral, Outlook, Teams, LinkedIn/Vivian/Wanderly'
    }
];

const phaseColors = {
    1: 'text-green-600 bg-green-100',
    2: 'text-blue-600 bg-blue-100',
    3: 'text-purple-600 bg-purple-100'
};

const phaseLabels = {
    1: 'MVP',
    2: 'Accountability',
    3: 'Coach + Learning'
};

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, recruiterInfo, onClose }) => {
    return (
        <div className="w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">{recruiterInfo.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{recruiterInfo.role}</p>
                        <p className="text-xs text-gray-400">{recruiterInfo.email}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-start px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                            currentView === item.id
                                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <div className="flex-1 text-left">
                            <div className="flex items-center justify-between mb-1">
                                <span>{item.label}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${phaseColors[item.phase]}`}>
                                    {phaseLabels[item.phase]}
                                </span>
                            </div>
                            {item.description && (
                                <p className="text-xs text-gray-500 leading-tight">{item.description}</p>
                            )}
                        </div>
                    </button>
                ))}
            </nav>

            {/* Phase Legend */}
            <div className="p-4 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Development Phases</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">MVP: Command Center + AI Assistant</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">Accountability: EOS/90 + NL Queries</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">Coach: Voice + Learning Center</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;