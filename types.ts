// Core Types
export interface JobDetails {
    jobTitle: string;
    specialty: string;
    city: string;
    state: string;
    payRate: string;
    duration: string;
    jobType: string;
    startDate: string;
}

export interface RecruiterInfo {
    name: string;
    email: string;
    phone: string;
    id?: string;
    role?: 'recruiter' | 'director';
}

// Phase 1 Types
export interface PipelineMetrics {
    toas: { current: number; goal: number };
    submissions: { current: number; goal: number };
    bookedCandidates: { current: number; goal: number };
    pipelineCount: { current: number; goal: number };
    calls: { current: number; goal: number };
    texts: { current: number; goal: number };
}

export interface CandidateBookmark {
    id: string;
    name: string;
    nexusUrl: string;
    status: 'Hot Lead' | 'Ready to Submit' | 'In Process' | 'Submitted' | 'Placed';
    readinessScore: number;
    specialty: string;
    location: string;
    notes: string;
    dateAdded: string;
    lastContact: string;
}

export interface ReadinessFactors {
    profileComplete: boolean;
    complianceDocs: boolean;
    references: boolean;
    availability: boolean;
}

// Phase 2 Types
export interface ToDo {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    assignedBy: string;
    dueDate: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: string;
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: 'credentialing' | 'system' | 'client' | 'candidate' | 'other';
    status: 'open' | 'discussed' | 'resolved';
    reportedBy: string;
    reportedAt: string;
    resolvedAt?: string;
    priority: 'low' | 'medium' | 'high';
}

// Phase 3 Types
export interface CoachingNudge {
    id: string;
    type: 'performance' | 'reminder' | 'suggestion' | 'celebration';
    message: string;
    actionable: boolean;
    action?: string;
    dismissed: boolean;
    createdAt: string;
}

export interface LearningGuide {
    id: string;
    title: string;
    description: string;
    category: string;
    steps: GuideStep[];
    createdBy: string;
    createdAt: string;
    isPublic: boolean;
    tags: string[];
}

export interface GuideStep {
    id: string;
    title: string;
    description: string;
    screenshot?: string;
    videoUrl?: string;
    order: number;
}

export interface WeeklyScorecard {
    recruiterId: string;
    weekOf: string;
    metrics: PipelineMetrics;
    performance: {
        callsPerDay: number;
        submissionRate: number;
        responseRate: number;
        pipelineGrowth: number;
    };
    aiInsights: string[];
    recommendations: string[];
}

// Social Media Types (from original)
export interface EmailVariation {
    subject: string;
    body: string;
}

export interface PostContent {
    variations: string[];
    strategy: string;
}

export interface EmailContent {
    variations: EmailVariation[];
    strategy: string;
}

export interface ThingsToDo {
    single: string[];
    couple: string[];
    family: string[];
}

export interface PlacesToStay {
    rvParks: string[];
    hotels: string[];
    travelerHousing: string[];
}

export interface SocialPosts {
    linkedin: PostContent;
    facebook: PostContent;
    instagram: PostContent;
    x: PostContent;
    sms: PostContent;
    email: EmailContent;
    thingsToDo: ThingsToDo;
    placesToStay: PlacesToStay;
}

// Navigation Types
export type AppView = 'dashboard' | 'todos' | 'issues' | 'social' | 'learning' | 'coaching';

export interface NavigationItem {
    id: AppView;
    label: string;
    icon: string;
    phase: 1 | 2 | 3;
}