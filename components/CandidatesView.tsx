import React, { useState } from 'react';
import { CandidateBookmark } from '../types';

interface CandidatesViewProps {
    candidates: CandidateBookmark[];
    setCandidates: (candidates: CandidateBookmark[]) => void;
}

const statusColors = {
    'Hot Lead': 'bg-red-100 text-red-800',
    'Ready to Submit': 'bg-green-100 text-green-800',
    'In Process': 'bg-yellow-100 text-yellow-800',
    'Submitted': 'bg-blue-100 text-blue-800',
    'Placed': 'bg-purple-100 text-purple-800'
};

const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
};

const CandidateCard: React.FC<{
    candidate: CandidateBookmark;
    onStatusChange: (id: string, status: CandidateBookmark['status']) => void;
}> = ({ candidate, onStatusChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.specialty} • {candidate.location}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className={`text-2xl font-bold ${getReadinessColor(candidate.readinessScore)}`}>
                        {candidate.readinessScore}%
                    </div>
                    <div className="text-xs text-gray-500">ready</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <select
                    value={candidate.status}
                    onChange={(e) => onStatusChange(candidate.id, e.target.value as CandidateBookmark['status'])}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusColors[candidate.status]}`}
                >
                    {Object.keys(statusColors).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                
                <a
                    href={candidate.nexusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                    View in Nexus →
                </a>
            </div>

            {candidate.notes && (
                <div className="mb-4">
                    <p className="text-sm text-gray-700">{candidate.notes}</p>
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Added: {new Date(candidate.dateAdded).toLocaleDateString()}</span>
                <span>Last Contact: {new Date(candidate.lastContact).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors">
                    Send Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                    Schedule Call
                </button>
            </div>
        </div>
    );
};

const CandidatesView: React.FC<CandidatesViewProps> = ({ candidates, setCandidates }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCandidate, setNewCandidate] = useState({
        name: '',
        specialty: '',
        location: '',
        nexusUrl: '',
        notes: ''
    });

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (id: string, status: CandidateBookmark['status']) => {
        setCandidates(candidates.map(candidate => 
            candidate.id === id ? { ...candidate, status } : candidate
        ));
    };

    const handleAddCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCandidate.name.trim() || !newCandidate.specialty.trim()) return;

        const candidate: CandidateBookmark = {
            id: Date.now().toString(),
            name: newCandidate.name,
            nexusUrl: newCandidate.nexusUrl || `https://nexus.example.com/candidate/${Date.now()}`,
            status: 'Hot Lead',
            readinessScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
            specialty: newCandidate.specialty,
            location: newCandidate.location,
            notes: newCandidate.notes,
            dateAdded: new Date().toISOString().split('T')[0],
            lastContact: new Date().toISOString().split('T')[0]
        };

        setCandidates([...candidates, candidate]);
        setNewCandidate({
            name: '',
            specialty: '',
            location: '',
            nexusUrl: '',
            notes: ''
        });
        setShowAddForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidate Bookmarks</h1>
                    <p className="text-gray-600">Manage your candidate pipeline and readiness scores</p>
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

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search candidates..."
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
                        {Object.keys(statusColors).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
                    <div className="text-sm text-gray-600">Total Candidates</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {candidates.filter(c => c.status === 'Ready to Submit').length}
                    </div>
                    <div className="text-sm text-gray-600">Ready to Submit</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">
                        {candidates.filter(c => c.status === 'Hot Lead').length}
                    </div>
                    <div className="text-sm text-gray-600">Hot Leads</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">
                        {candidates.filter(c => c.status === 'Placed').length}
                    </div>
                    <div className="text-sm text-gray-600">Placed</div>
                </div>
            </div>

            {/* Add Candidate Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Candidate</h3>
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={newCandidate.location}
                                    onChange={(e) => setNewCandidate({...newCandidate, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Phoenix, AZ"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nexus URL
                                </label>
                                <input
                                    type="url"
                                    value={newCandidate.nexusUrl}
                                    onChange={(e) => setNewCandidate({...newCandidate, nexusUrl: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="https://nexus.example.com/candidate/123"
                                />
                            </div>
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