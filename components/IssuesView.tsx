import React, { useState } from 'react';
import { Issue, RecruiterInfo } from '../types';

// EOS IDS Enhancement Function
const enhanceWithIDS = (title: string, description: string, category: Issue['category']): string => {
    const baseDescription = description || title;
    
    const categoryTips = {
        credentialing: {
            identify: "Document specific credentialing delays, missing documents, or compliance issues",
            discuss: "Review with compliance team, identify root causes, check vendor performance",
            solve: "Implement backup vendors, create candidate prep checklists, set up tracking systems"
        },
        system: {
            identify: "Specify system performance issues, error messages, or workflow disruptions",
            discuss: "Engage IT team, assess impact on productivity, review system requirements",
            solve: "Implement workarounds, schedule system updates, consider alternative tools"
        },
        client: {
            identify: "Detail client communication gaps, feedback delays, or expectation misalignments",
            discuss: "Schedule client meeting, review service level agreements, assess relationship health",
            solve: "Set clear communication protocols, establish regular check-ins, document agreements"
        },
        candidate: {
            identify: "Specify candidate concerns, availability changes, or quality issues",
            discuss: "Review sourcing strategies, assess screening processes, check market conditions",
            solve: "Improve candidate experience, enhance screening criteria, expand sourcing channels"
        },
        other: {
            identify: "Clearly define the issue and its impact on operations",
            discuss: "Involve relevant stakeholders, gather all perspectives, assess urgency",
            solve: "Develop action plan, assign ownership, set follow-up schedule"
        }
    };
    
    const tips = categoryTips[category];
    
    return `${baseDescription}

🎯 EOS IDS Framework:

🔍 IDENTIFY:
${tips.identify}

💬 DISCUSS:
${tips.discuss}

✅ SOLVE:
${tips.solve}

📊 Next Steps:
1. Gather all relevant data and stakeholder input
2. Schedule discussion with appropriate team members
3. Define specific, measurable solutions
4. Assign clear ownership and deadlines
5. Set follow-up review date

⚡ EOS Tip: Keep discussions focused on solutions, not blame. Every issue is an opportunity to strengthen your systems.`;
};

interface IssuesViewProps {
    issues: Issue[];
    setIssues: (issues: Issue[]) => void;
    recruiterInfo: RecruiterInfo;
}

const categoryColors = {
    credentialing: 'bg-red-100 text-red-800',
    system: 'bg-blue-100 text-blue-800',
    client: 'bg-green-100 text-green-800',
    candidate: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
};

const statusColors = {
    open: 'bg-red-100 text-red-800',
    discussed: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
};

const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
};

const IssueCard: React.FC<{
    issue: Issue;
    onStatusChange: (id: string, status: Issue['status']) => void;
    onDelete: (id: string) => void;
}> = ({ issue, onStatusChange, onDelete }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                </div>
                
                <button
                    onClick={() => onDelete(issue.id)}
                    className="text-gray-400 hover:text-red-500 ml-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[issue.category]}`}>
                    {issue.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority} priority
                </span>
                <select
                    value={issue.status}
                    onChange={(e) => onStatusChange(issue.id, e.target.value as Issue['status'])}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[issue.status]}`}
                >
                    <option value="open">Open</option>
                    <option value="discussed">Discussed</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Reported by: {issue.reportedBy}</span>
                <span>
                    {new Date(issue.reportedAt).toLocaleDateString()}
                    {issue.resolvedAt && ` • Resolved: ${new Date(issue.resolvedAt).toLocaleDateString()}`}
                </span>
            </div>
        </div>
    );
};

const IssuesView: React.FC<IssuesViewProps> = ({ issues, setIssues, recruiterInfo }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [newIssue, setNewIssue] = useState({
        title: '',
        description: '',
        category: 'other' as Issue['category'],
        priority: 'medium' as Issue['priority']
    });

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
        return matchesStatus && matchesCategory;
    });

    const handleStatusChange = (id: string, status: Issue['status']) => {
        setIssues(issues.map(issue => 
            issue.id === id ? { 
                ...issue, 
                status,
                resolvedAt: status === 'resolved' ? new Date().toISOString() : issue.resolvedAt
            } : issue
        ));
    };

    const handleDeleteIssue = (id: string) => {
        setIssues(issues.filter(issue => issue.id !== id));
    };

    const handleAddIssue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIssue.title.trim()) return;

        // EOS IDS Enhancement
        const enhancedDescription = enhanceWithIDS(newIssue.title, newIssue.description, newIssue.category);

        const issue: Issue = {
            id: Date.now().toString(),
            title: newIssue.title,
            description: enhancedDescription,
            category: newIssue.category,
            status: 'open',
            reportedBy: recruiterInfo.name,
            reportedAt: new Date().toISOString(),
            priority: newIssue.priority
        };

        setIssues([...issues, issue]);
        setNewIssue({
            title: '',
            description: '',
            category: 'other',
            priority: 'medium'
        });
        setShowAddForm(false);
    };

    const openIssues = issues.filter(i => i.status === 'open');
    const discussedIssues = issues.filter(i => i.status === 'discussed');
    const resolvedIssues = issues.filter(i => i.status === 'resolved');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Issues Tracker</h1>
                    <p className="text-gray-600">EOS-style issue tracking and resolution</p>
                </div>
                
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2 5a4 4 0 01-4-4V8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0017.07 6H18a2 2 0 012 2v9a4 4 0 01-4 4H8a4 4 0 01-4-4v-1z" />
                    </svg>
                    Log Issue
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">{openIssues.length}</div>
                    <div className="text-sm text-gray-600">Open Issues</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{discussedIssues.length}</div>
                    <div className="text-sm text-gray-600">Discussed</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{resolvedIssues.length}</div>
                    <div className="text-sm text-gray-600">Resolved</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
                    <div className="text-sm text-gray-600">Total Issues</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="discussed">Discussed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Categories</option>
                        <option value="credentialing">Credentialing</option>
                        <option value="system">System</option>
                        <option value="client">Client</option>
                        <option value="candidate">Candidate</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Add Issue Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <form onSubmit={handleAddIssue} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Title
                            </label>
                            <input
                                type="text"
                                value={newIssue.title}
                                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newIssue.description}
                                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newIssue.category}
                                    onChange={(e) => setNewIssue({...newIssue, category: e.target.value as Issue['category']})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="credentialing">Credentialing</option>
                                    <option value="system">System</option>
                                    <option value="client">Client</option>
                                    <option value="candidate">Candidate</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={newIssue.priority}
                                    onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as Issue['priority']})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
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
                                Log Issue
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                    <IssueCard
                        key={issue.id}
                        issue={issue}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteIssue}
                    />
                ))}
            </div>

            {filteredIssues.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
                    <p className="mt-1 text-sm text-gray-500">Issues will appear here when they are logged.</p>
                </div>
            )}
        </div>
    );
};

export default IssuesView;