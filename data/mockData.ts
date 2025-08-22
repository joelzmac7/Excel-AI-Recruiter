import { 
    RecruiterInfo, 
    PipelineMetrics, 
    CandidateBookmark, 
    ToDo, 
    Issue, 
    CoachingNudge, 
    LearningGuide 
} from '../types';

export const mockData = {
    recruiterInfo: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@excelmedstaff.com',
        phone: '(555) 123-4567',
        role: 'recruiter' as const
    } as RecruiterInfo,

    pipelineMetrics: {
        toas: { current: 8, goal: 12 },
        submissions: { current: 15, goal: 20 },
        bookedCandidates: { current: 6, goal: 8 },
        pipelineCount: { current: 45, goal: 50 },
        calls: { current: 32, goal: 40 },
        texts: { current: 28, goal: 35 }
    } as PipelineMetrics,

    candidates: [
        {
            id: '1',
            name: 'Jennifer Martinez',
            nexusUrl: 'https://nexus.example.com/candidate/1',
            status: 'Ready to Submit' as const,
            readinessScore: 95,
            specialty: 'ICU RN',
            location: 'Phoenix, AZ',
            notes: 'Excellent references, available immediately. Prefers 13-week assignments.',
            dateAdded: '2024-01-15',
            lastContact: '2024-01-20'
        },
        {
            id: '2',
            name: 'Michael Chen',
            nexusUrl: 'https://nexus.example.com/candidate/2',
            status: 'Hot Lead' as const,
            readinessScore: 75,
            specialty: 'OR Tech',
            location: 'Dallas, TX',
            notes: 'Interested in Texas assignments. Needs to complete compliance docs.',
            dateAdded: '2024-01-18',
            lastContact: '2024-01-19'
        },
        {
            id: '3',
            name: 'Amanda Rodriguez',
            nexusUrl: 'https://nexus.example.com/candidate/3',
            status: 'In Process' as const,
            readinessScore: 88,
            specialty: 'Med Surg RN',
            location: 'Denver, CO',
            notes: 'Currently interviewing with Banner Health. Strong candidate.',
            dateAdded: '2024-01-10',
            lastContact: '2024-01-21'
        },
        {
            id: '4',
            name: 'David Thompson',
            nexusUrl: 'https://nexus.example.com/candidate/4',
            status: 'Submitted' as const,
            readinessScore: 92,
            specialty: 'ER RN',
            location: 'Miami, FL',
            notes: 'Submitted to Jackson Health. Awaiting client response.',
            dateAdded: '2024-01-12',
            lastContact: '2024-01-20'
        },
        {
            id: '5',
            name: 'Lisa Park',
            nexusUrl: 'https://nexus.example.com/candidate/5',
            status: 'Placed' as const,
            readinessScore: 100,
            specialty: 'NICU RN',
            location: 'Seattle, WA',
            notes: 'Successfully placed at Seattle Children\'s. Start date: 02/01/2024.',
            dateAdded: '2024-01-05',
            lastContact: '2024-01-22'
        }
    ] as CandidateBookmark[],

    todos: [
        {
            id: '1',
            title: 'Follow up with Jennifer Martinez',
            description: 'Check on compliance document status and confirm start date preferences',
            assignedTo: 'Sarah Johnson',
            assignedBy: 'Sarah Johnson',
            dueDate: '2024-01-25',
            completed: false,
            priority: 'high' as const,
            category: 'Follow-up',
            createdAt: '2024-01-22T10:00:00Z'
        },
        {
            id: '2',
            title: 'Submit Michael Chen to Dallas positions',
            description: 'Review available OR Tech positions in Dallas area and submit qualified candidates',
            assignedTo: 'Sarah Johnson',
            assignedBy: 'Director',
            dueDate: '2024-01-24',
            completed: false,
            priority: 'medium' as const,
            category: 'Submissions',
            createdAt: '2024-01-21T14:30:00Z'
        },
        {
            id: '3',
            title: 'Update CRM with new candidate information',
            description: 'Input details for 3 new candidates from yesterday\'s sourcing session',
            assignedTo: 'Sarah Johnson',
            assignedBy: 'Sarah Johnson',
            dueDate: '2024-01-23',
            completed: true,
            priority: 'low' as const,
            category: 'Admin',
            createdAt: '2024-01-20T09:15:00Z'
        },
        {
            id: '4',
            title: 'Prepare for weekly team meeting',
            description: 'Review pipeline metrics and prepare status update for director',
            assignedTo: 'Sarah Johnson',
            assignedBy: 'Director',
            dueDate: '2024-01-26',
            completed: false,
            priority: 'medium' as const,
            category: 'Meetings',
            createdAt: '2024-01-22T16:45:00Z'
        }
    ] as ToDo[],

    issues: [
        {
            id: '1',
            title: 'Credentialing delays for Arizona licenses',
            description: 'Multiple candidates experiencing 2-3 week delays in Arizona nursing license verification. This is impacting our ability to place candidates in Phoenix market.',
            category: 'credentialing' as const,
            status: 'open' as const,
            reportedBy: 'Sarah Johnson',
            reportedAt: '2024-01-20T11:30:00Z',
            priority: 'high' as const
        },
        {
            id: '2',
            title: 'Nexus system slow during peak hours',
            description: 'CRM system becomes unresponsive between 2-4 PM daily, affecting productivity during prime calling hours.',
            category: 'system' as const,
            status: 'discussed' as const,
            reportedBy: 'Sarah Johnson',
            reportedAt: '2024-01-18T15:20:00Z',
            priority: 'medium' as const
        },
        {
            id: '3',
            title: 'Client feedback delay from Banner Health',
            description: 'Banner Health has been taking 5+ days to provide feedback on submitted candidates, causing candidates to lose interest.',
            category: 'client' as const,
            status: 'resolved' as const,
            reportedBy: 'Sarah Johnson',
            reportedAt: '2024-01-15T09:45:00Z',
            resolvedAt: '2024-01-22T14:20:00Z',
            priority: 'medium' as const
        }
    ] as Issue[],

    nudges: [
        {
            id: '1',
            type: 'performance' as const,
            message: 'You\'re at 72% of your daily call goal. Want me to draft 3 quick follow-up texts to boost your outreach?',
            actionable: true,
            action: 'Draft follow-up texts',
            dismissed: false,
            createdAt: '2024-01-22T14:00:00Z'
        },
        {
            id: '2',
            type: 'reminder' as const,
            message: 'You have 2 high-priority to-dos due today. Jennifer Martinez follow-up and Michael Chen submission are both pending.',
            actionable: true,
            action: 'View pending tasks',
            dismissed: false,
            createdAt: '2024-01-22T09:00:00Z'
        },
        {
            id: '3',
            type: 'suggestion' as const,
            message: 'Your TOAs are down 15% from last month. Consider focusing on ICU and OR specialties - they\'re showing higher response rates.',
            actionable: true,
            action: 'View specialty analytics',
            dismissed: false,
            createdAt: '2024-01-22T08:30:00Z'
        },
        {
            id: '4',
            type: 'celebration' as const,
            message: 'Congratulations! You\'ve successfully placed 3 candidates this month, exceeding your goal by 50%. Keep up the excellent work!',
            actionable: false,
            dismissed: false,
            createdAt: '2024-01-21T17:00:00Z'
        }
    ] as CoachingNudge[],

    guides: [
        {
            id: '1',
            title: 'How to Create a Complete Candidate Profile',
            description: 'Step-by-step guide for setting up comprehensive candidate profiles in Nexus CRM',
            category: 'CRM Management',
            steps: [
                {
                    id: '1-1',
                    title: 'Access Candidate Creation',
                    description: 'Navigate to the Candidates section and click "Add New Candidate"',
                    order: 1
                },
                {
                    id: '1-2',
                    title: 'Enter Basic Information',
                    description: 'Fill in name, contact information, and specialty details',
                    order: 2
                },
                {
                    id: '1-3',
                    title: 'Upload Documents',
                    description: 'Add resume, licenses, and certifications to the candidate profile',
                    order: 3
                },
                {
                    id: '1-4',
                    title: 'Set Preferences',
                    description: 'Configure location preferences, assignment duration, and pay requirements',
                    order: 4
                }
            ],
            createdBy: 'Training Team',
            createdAt: '2024-01-10T10:00:00Z',
            isPublic: true,
            tags: ['nexus', 'candidates', 'setup']
        },
        {
            id: '2',
            title: 'Effective Cold Calling Techniques',
            description: 'Best practices for initial candidate outreach and building rapport',
            category: 'Sourcing',
            steps: [
                {
                    id: '2-1',
                    title: 'Research the Candidate',
                    description: 'Review LinkedIn profile and current employment before calling',
                    order: 1
                },
                {
                    id: '2-2',
                    title: 'Prepare Your Opening',
                    description: 'Craft a personalized introduction mentioning their specialty and experience',
                    order: 2
                },
                {
                    id: '2-3',
                    title: 'Ask Discovery Questions',
                    description: 'Understand their current situation and career goals',
                    order: 3
                }
            ],
            createdBy: 'Sarah Johnson',
            createdAt: '2024-01-15T14:30:00Z',
            isPublic: false,
            tags: ['calling', 'sourcing', 'outreach']
        },
        {
            id: '3',
            title: 'Submission Process Checklist',
            description: 'Complete checklist for submitting candidates to client opportunities',
            category: 'Submissions',
            steps: [
                {
                    id: '3-1',
                    title: 'Verify Candidate Readiness',
                    description: 'Ensure all compliance documents are current and complete',
                    order: 1
                },
                {
                    id: '3-2',
                    title: 'Match Requirements',
                    description: 'Confirm candidate meets all job requirements and preferences',
                    order: 2
                },
                {
                    id: '3-3',
                    title: 'Prepare Submission Package',
                    description: 'Compile resume, references, and required documentation',
                    order: 3
                },
                {
                    id: '3-4',
                    title: 'Submit and Follow Up',
                    description: 'Send submission to client and schedule follow-up reminder',
                    order: 4
                }
            ],
            createdBy: 'Training Team',
            createdAt: '2024-01-08T11:15:00Z',
            isPublic: true,
            tags: ['submissions', 'process', 'checklist']
        }
    ] as LearningGuide[]
};