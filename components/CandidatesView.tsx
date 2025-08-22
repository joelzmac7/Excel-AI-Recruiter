import React, { useState } from 'react';
import { CandidateBookmark, ReadinessFactors } from '../types';

interface CandidatesViewProps {
    candidates: CandidateBookmark[];
    setCandidates: (candidates: CandidateBookmark[]) => void;
}

const getReadinessColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
};

const getReadinessLabel = (score: number) => {
    if (score >= 85) return 'Ready';
    if (score >= 60) return 'In Progress';
    return 'Needs Work';
};

const CandidateCard: React.FC<{
    candidate: CandidateBookmark;
    onStatusChange: (id: string, status: string) => void;
    onReadinessUpdate: (id: string, score: number) => void;
    onOpenATS: (url: string) => void;
}> = ({ candidate, onStatusChange, onReadinessUpdate, onOpenATS }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const handleATSClick = () => {
        onOpenATS(candidate.atsUrl);
    };

    const mockReadinessFactors: ReadinessFactors = {
        profileCompleteness: Math.floor(candidate.readinessScore * 0.8),
        requiredDocs: {
            'License': candidate.readinessScore > 70,
            'Resume': candidate.readinessScore > 50,
            'References': candidate.readinessScore > 80,
            'Compliance': candidate.readinessScore > 85
        },
        recentEngagement: candidate.readinessScore > 60,
        recruiterNotes: candidate.notes || ''
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.specialty}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getReadinessColor(candidate.readinessScore)}`}>
                        {candidate.readinessScore}% {getReadinessLabel(candidate.readinessScore)}
                    </div>
                    <select
                        value={candidate.statusTag}
                        onChange={(e) => onStatusChange(candidate.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        <option value="Hot Lead">Hot Lead</option>
                        <option value="Compliance Hold">Compliance Hold</option>
                        <option value="Ready to Submit">Ready to Submit</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Placed">Placed</option>
                        <option value="Not Interested">Not Interested</option>
                    </select>
                </div>
            </div>

            {candidate.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{candidate.notes}</p>
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Added: {new Date(candidate.createdAt).toLocaleDateString()}</span>
                <span>Last Contact: {new Date(candidate.lastContactAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    {showDetails ? 'Hide' : 'Show'} Readiness Details
                </button>
                
                <div className="flex space-x-2">
                    <button
                        onClick={handleATSClick}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors"
                        title="One-click return to ATS profile"
                    >
                        Open in Nexus
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                        Message
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Readiness Breakdown</h4>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Profile Completeness</span>
                            <span className="text-sm font-medium">{mockReadinessFactors.profileCompleteness}%</span>
                        </div>
                        
                        <div className="space-y-1">
                            <span className="text-sm text-gray-600">Required Documents</span>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(mockReadinessFactors.requiredDocs).map(([doc, completed]) => (
                                    <div key={doc} className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xs text-gray-600">{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Recent Engagement</span>
                            <span className={`text-sm font-medium ${mockReadinessFactors.recentEngagement ? 'text-green-600' : 'text-red-600'}`}>
                                {mockReadinessFactors.recentEngagement ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CandidatesView: React.FC<CandidatesViewProps> = ({ candidates, setCandidates }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [readinessFilter, setReadinessFilter] = useState<string>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCandidate, setNewCandidate] = useState({
        name: '',
        specialty: '',
        tags: '',
        notes: ''
    });

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || candidate.statusTag === statusFilter;
        const matchesReadiness = readinessFilter === 'all' || 
            (readinessFilter === 'ready' && candidate.readinessScore >= 85) ||
            (readinessFilter === 'in-progress' && candidate.readinessScore >= 60 && candidate.readinessScore < 85) ||
            (readinessFilter === 'needs-work' && candidate.readinessScore < 60);
        return matchesSearch && matchesStatus && matchesReadiness;
    });

    const handleStatusChange = (id: string, status: string) => {
        setCandidates(candidates.map(candidate => 
            candidate.id === id ? { ...candidate, statusTag: status } : candidate
        ));
    };

    const handleReadinessUpdate = (id: string, score: number) => {
        setCandidates(candidates.map(candidate => 
            candidate.id === id ? { ...candidate, readinessScore: score } : candidate
        ));
    };

    const handleOpenATS = (url: string) => {
        // In Island sidebar, this would capture current page URL
        window.open(url, '_blank');
    };

    const handleAddCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCandidate.name.trim() || !newCandidate.specialty.trim()) return;

        const candidate: CandidateBookmark = {
            id: Date.now().toString(),
            recruiterId: 'current-user',
            name: newCandidate.name,
            specialty: newCandidate.specialty,
            statusTag: 'Hot Lead',
            readinessScore: Math.floor(Math.random() * 40) + 60, // 60-100
            atsUrl: `https://nexus.example.com/candidate/${Date.now()}`, // Would capture current page URL
            lastContactAt: new Date().toISOString(),
            tags: newCandidate.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            notes: newCandidate.notes,
            createdAt: new Date().toISOString()
        };

        setCandidates([...candidates, candidate]);
        setNewCandidate({
            name: '',
            specialty: '',
            tags: '',
            notes: ''
        });
        setShowAddForm(false);
    };

    const readyCandidates = candidates.filter(c => c.readinessScore >= 85);
    const inProgressCandidates = candidates.filter(c => c.readinessScore >= 60 && c.readinessScore < 85);
    const needsWorkCandidates = candidates.filter(c => c.readinessScore < 60);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidate Bookmarks</h1>
                    <p className="text-gray-600">Name, specialty, tags, ATS URL capture, readiness scores 0-100</p>
                </div>
                
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Candidate
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
                    <div className="text-sm text-gray-600">Total Bookmarks</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{readyCandidates.length}</div>
                    <div className="text-sm text-gray-600">Ready (≥85%)</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{inProgressCandidates.length}</div>
                    <div className="text-sm text-gray-600">In Progress (60-84%)</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">{needsWorkCandidates.length}</div>
                    <div className="text-sm text-gray-600">Needs Work (&lt;60%)</div>
                </div>
            </div>

            {/* Natural Language Query Helper */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Natural Language Search</h2>
                </div>
                
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Try: 'Show submission-ready ICU RNs in TX this week' or 'Find candidates ≥85 readiness, MedSurg, available in 2 weeks'"
                        className="flex-1 px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Search
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search candidates, specialties, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Hot Lead">Hot Lead</option>
                        <option value="Compliance Hold">Compliance Hold</option>
                        <option value="Ready to Submit">Ready to Submit</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Placed">Placed</option>
                    </select>
                    
                    <select
                        value={readinessFilter}
                        onChange={(e) => setReadinessFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Readiness</option>
                        <option value="ready">Ready (≥85%)</option>
                        <option value="in-progress">In Progress (60-84%)</option>
                        <option value="needs-work">Needs Work (&lt;60%)</option>
                    </select>
                </div>
            </div>

            {/* Add Candidate Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Candidate Bookmark</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        In Island sidebar, this would auto-capture the current ATS page URL for one-click return.
                    </p>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Candidate Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCandidate.name}
                                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialty *
                                </label>
                                <input
                                    type="text"
                                    value={newCandidate.specialty}
                                    onChange={(e) => setNewCandidate({...newCandidate, specialty: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="ICU RN, OR Tech, etc."
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={newCandidate.tags}
                                onChange={(e) => setNewCandidate({...newCandidate, tags: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Texas, Night Shift, CCRN"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={newCandidate.notes}
                                onChange={(e) => setNewCandidate({...newCandidate, notes: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Any additional notes about the candidate..."
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Add Candidate
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onStatusChange={handleStatusChange}
                        onReadinessUpdate={handleReadinessUpdate}
                        onOpenATS={handleOpenATS}
                    />
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first candidate bookmark.</p>
                </div>
            )}
        </div>
    );
};

export default CandidatesView;