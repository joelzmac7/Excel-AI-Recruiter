import React from 'react';
import { AppView, RecruiterInfo, NavigationItem } from '../types';

interface NavigationProps {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    recruiterInfo: RecruiterInfo;
    onClose?: () => void;
}

const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z', phase: 1 },
    { id: 'candidates', label: 'Candidates', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', phase: 1 },
    { id: 'todos', label: 'To-Dos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', phase: 2 },
    { id: 'issues', label: 'Issues', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z', phase: 2 },
    { id: 'social', label: 'Social Media', icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1h-1v9a3 3 0 01-3 3H8a3 3 0 01-3-3V7H4a1 1 0 01-1-1V5a1 1 0 011-1h3z', phase: 1 },
    { id: 'learning', label: 'Learning Center', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', phase: 3 },
    { id: 'coaching', label: 'AI Coaching', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', phase: 3 }
];

const phaseColors = {
    1: 'text-green-600 bg-green-100',
    2: 'text-blue-600 bg-blue-100',
    3: 'text-purple-600 bg-purple-100'
};

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, recruiterInfo, onClose }) => {
    return (
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">{recruiterInfo.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{recruiterInfo.role || 'recruiter'}</p>
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
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentView === item.id
                                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <span className="flex-1 text-left">{item.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${phaseColors[item.phase]}`}>
                            P{item.phase}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Phase Legend */}
            <div className="p-4 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Phases</h4>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">Foundation & Pipeline</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">Accountability & EOS</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">AI Coaching & Learning</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;