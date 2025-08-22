import React, { useState, useCallback, useEffect } from 'react';
import { AppView, RecruiterInfo, PipelineMetrics, CandidateBookmark, ToDo, Issue, CoachingNudge, LearningGuide } from './types';
import { COMPANY_LOGO_URL, COMPANY_NAME } from './constants';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TodosView from './components/TodosView';
import IssuesView from './components/IssuesView';
import SocialMediaView from './components/SocialMediaView';
import LearningCenter from './components/LearningCenter';
import CoachingView from './components/CoachingView';
import AIAssistant from './components/AIAssistant';
import { mockData } from './data/mockData';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>('dashboard');
    const [recruiterInfo, setRecruiterInfo] = useState<RecruiterInfo>(mockData.recruiterInfo);
    const [isInsideIframe, setIsInsideIframe] = useState(false);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

    // Data states
    const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetrics>(mockData.pipelineMetrics);
    const [candidates, setCandidates] = useState<CandidateBookmark[]>(mockData.candidates);
    const [todos, setTodos] = useState<ToDo[]>(mockData.todos);
    const [issues, setIssues] = useState<Issue[]>(mockData.issues);
    const [nudges, setNudges] = useState<CoachingNudge[]>(mockData.nudges);
    const [guides, setGuides] = useState<LearningGuide[]>(mockData.guides);

    useEffect(() => {
        setIsInsideIframe(window.self !== window.top);

        const handleRpaMessage = async (event: MessageEvent) => {
            const data = event.data;
            if (data && data.type === 'INIT_RECRUITER_APP' && data.payload) {
                if (data.payload.recruiterInfo) {
                    setRecruiterInfo(prevInfo => ({ ...prevInfo, ...data.payload.recruiterInfo }));
                }
            }
        };

        window.addEventListener('message', handleRpaMessage);
        return () => window.removeEventListener('message', handleRpaMessage);
    }, []);

    const handleCloseApp = () => {
        window.parent.postMessage({ type: 'CLOSE_RECRUITER_APP' }, '*');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard 
                    metrics={pipelineMetrics} 
                    setPipelineMetrics={setPipelineMetrics} 
                    nudges={nudges}
                    recruiterInfo={recruiterInfo}
                />;
            case 'candidates':
                return <CandidatesView candidates={candidates} setCandidates={setCandidates} />;
            case 'todos':
                return <TodosView todos={todos} setTodos={setTodos} recruiterInfo={recruiterInfo} />;
            case 'issues':
                return <IssuesView issues={issues} setIssues={setIssues} recruiterInfo={recruiterInfo} />;
            case 'social':
                return <SocialMediaView />;
            case 'learning':
                return <LearningCenter guides={guides} setGuides={setGuides} recruiterInfo={recruiterInfo} />;
            case 'coaching':
                return <CoachingView nudges={nudges} setNudges={setNudges} recruiterInfo={recruiterInfo} />;
            case 'integrations':
                return <IntegrationsView integrations={mockData.integrations} setIntegrations={() => {}} />;
            default:
                return <Dashboard 
                    metrics={pipelineMetrics} 
                    setPipelineMetrics={setPipelineMetrics} 
                    nudges={nudges}
                    recruiterInfo={recruiterInfo}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex">
            {/* Sidebar Navigation */}
            <Navigation 
                currentView={currentView} 
                setCurrentView={setCurrentView}
                recruiterInfo={recruiterInfo}
                onClose={isInsideIframe ? handleCloseApp : undefined}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="h-8 w-auto" />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">AI Recruiter Assistant</h1>
                                <p className="text-sm text-gray-500">Welcome back, {recruiterInfo.name}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAIAssistantOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                AI Assistant
                            </button>
                            
                            {isInsideIframe && (
                                <button
                                    onClick={handleCloseApp}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderCurrentView()}
                </main>
            </div>

            {/* AI Assistant Modal */}
            {isAIAssistantOpen && (
                <AIAssistant
                    isOpen={isAIAssistantOpen}
                    onClose={() => setIsAIAssistantOpen(false)}
                    recruiterInfo={recruiterInfo}
                    currentView={currentView}
                    contextData={{
                        metrics: pipelineMetrics,
                        candidates,
                        todos,
                        issues
                    }}
                />
            )}
        </div>
    );
};

export default App;