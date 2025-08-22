import React, { useState } from 'react';
import { LearningGuide, RecruiterInfo } from '../types';

interface LearningCenterProps {
    guides: LearningGuide[];
    setGuides: (guides: LearningGuide[]) => void;
    recruiterInfo: RecruiterInfo;
}

const GuideCard: React.FC<{
    guide: LearningGuide;
    onView: (guide: LearningGuide) => void;
    onDelete: (id: string) => void;
}> = ({ guide, onView, onDelete }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                            {guide.category}
                        </span>
                        {guide.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <button
                    onClick={() => onDelete(guide.id)}
                    className="text-gray-400 hover:text-red-500 ml-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created by: {guide.createdBy}</span>
                <span>{new Date(guide.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{guide.steps.length} steps</span>
                <button
                    onClick={() => onView(guide)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                    View Guide
                </button>
            </div>
        </div>
    );
};

const GuideViewer: React.FC<{
    guide: LearningGuide;
    onClose: () => void;
}> = ({ guide, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <header className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{guide.title}</h2>
                        <p className="text-sm text-gray-600">{guide.description}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Steps Navigation */}
                    <div className="w-1/4 bg-gray-50 p-4 overflow-y-auto">
                        <h3 className="font-semibold text-gray-900 mb-4">Steps</h3>
                        <div className="space-y-2">
                            {guide.steps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                                        currentStep === index
                                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <div className="font-medium">Step {index + 1}</div>
                                    <div className="text-xs opacity-75">{step.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {guide.steps[currentStep] && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Step {currentStep + 1}: {guide.steps[currentStep].title}
                                </h3>
                                <p className="text-gray-700 mb-6">{guide.steps[currentStep].description}</p>
                                
                                {guide.steps[currentStep].screenshot && (
                                    <div className="mb-6">
                                        <img
                                            src={guide.steps[currentStep].screenshot}
                                            alt={`Step ${currentStep + 1} screenshot`}
                                            className="w-full rounded-lg border border-gray-200"
                                        />
                                    </div>
                                )}
                                
                                {guide.steps[currentStep].videoUrl && (
                                    <div className="mb-6">
                                        <video
                                            src={guide.steps[currentStep].videoUrl}
                                            controls
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500 self-center">
                        {currentStep + 1} of {guide.steps.length}
                    </span>
                    <button
                        onClick={() => setCurrentStep(Math.min(guide.steps.length - 1, currentStep + 1))}
                        disabled={currentStep === guide.steps.length - 1}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const LearningCenter: React.FC<LearningCenterProps> = ({ guides, setGuides, recruiterInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedGuide, setSelectedGuide] = useState<LearningGuide | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'all' || guide.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDeleteGuide = (id: string) => {
        setGuides(guides.filter(guide => guide.id !== id));
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        // In a real implementation, this would start screen recording
        alert('Screen recording started! This would capture your screen and create a step-by-step guide.');
        
        // Simulate recording completion after 3 seconds
        setTimeout(() => {
            setIsRecording(false);
            alert('Recording complete! Guide has been saved to your library.');
        }, 3000);
    };

    const categories = [...new Set(guides.map(g => g.category))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
                    <p className="text-gray-600">Create and access step-by-step guides and training materials</p>
                </div>
                
                <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
                        isRecording 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-primary-600 hover:bg-primary-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {isRecording ? 'Recording...' : 'Record Steps'}
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search guides..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{guides.length}</div>
                    <div className="text-sm text-gray-600">Total Guides</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-primary-600">
                        {guides.filter(g => g.createdBy === recruiterInfo.name).length}
                    </div>
                    <div className="text-sm text-gray-600">My Guides</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {guides.filter(g => g.isPublic).length}
                    </div>
                    <div className="text-sm text-gray-600">Public Guides</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                </div>
            </div>

            {/* AI Search Helper */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">AI Search</h2>
                </div>
                
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Ask AI: 'Show me how to create a resume' or 'How do I submit a candidate?'"
                        className="flex-1 px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Search
                    </button>
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                    <GuideCard
                        key={guide.id}
                        guide={guide}
                        onView={setSelectedGuide}
                        onDelete={handleDeleteGuide}
                    />
                ))}
            </div>

            {filteredGuides.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No guides found</h3>
                    <p className="mt-1 text-sm text-gray-500">Start by recording your first step-by-step guide.</p>
                </div>
            )}

            {/* Guide Viewer Modal */}
            {selectedGuide && (
                <GuideViewer
                    guide={selectedGuide}
                    onClose={() => setSelectedGuide(null)}
                />
            )}
        </div>
    );
};

export default LearningCenter;