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
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'recruiter' | 'manager' | 'admin';
    goals: RecruiterGoals;
}

export interface RecruiterGoals {
    callsPerDay: number;
    submissionsPerWeek: number;
    smsPerDay: number;
    toasPerWeek: number;
    bookedPerMonth: number;
    pipelineCount: number;
}

// Phase 1 Types - Command Center
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
    recruiterId: string;
    name: string;
    specialty: string;
    statusTag: string; // User-defined: Hot Lead, Compliance Hold, Ready to Submit
    readinessScore: number; // 0-100
    atsUrl: string; // Current page URL for one-click return
    lastContactAt: string;
    tags: string[];
    notes?: string;
    createdAt: string;
}

export interface ReadinessFactors {
    profileCompleteness: number; // 0-100%
    requiredDocs: { [key: string]: boolean }; // e.g., { license: true, resume: false }
    recentEngagement: boolean; // Last reply within X days
    recruiterNotes: string;
}

export interface MetricsSnapshot {
    id: string;
    recruiterId: string;
    period: 'daily' | 'weekly' | 'monthly';
    date: string;
    calls: number;
    sms: number;
    submissions: number;
    booked: number;
    toas: number;
}

// Phase 2 Types - Accountability & EOS/90
export interface ToDo {
    id: string;
    assigneeId: string;
    creatorId: string;
    title: string;
    description: string;
    dueAt: string;
    status: 'open' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: string;
    completedAt?: string;
}

export interface Issue {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    tags: string[]; // Compliance, Pay, Client, etc.
    state: 'open' | 'discussed' | 'resolved';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    discussedAt?: string;
    resolvedAt?: string;
    assignedTo?: string;
}

export interface PayPackageCalculation {
    billRate: number;
    stipends: { [key: string]: number };
    overtimeRules: string;
    estimatedWeeklyTakeHome: number;
    explanation: string;
}

// Phase 3 Types - Coach + Learning Center
export interface CoachingNudge {
    id: string;
    type: 'goal-progress' | 'contract-ending' | 'follow-up-reminder' | 'celebration';
    message: string;
    actionable: boolean;
    suggestedAction?: string;
    dismissed: boolean;
    createdAt: string;
    recruiterId: string;
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
    screenshots?: string[];
    transcript?: string;
}

export interface GuideStep {
    id: string;
    title: string;
    description: string;
    screenshot?: string;
    videoUrl?: string;
    order: number;
}

// Integration Types
export interface IntegrationAdapter {
    name: 'nexus' | 'sense' | 'ringcentral' | 'outlook' | 'teams' | 'linkedin';
    connected: boolean;
    lastSync?: string;
    config?: { [key: string]: any };
}

export interface NexusCandidate {
    id: string;
    name: string;
    specialty: string;
    profileUrl: string;
    submissionStatus?: string;
    placementStatus?: string;
}

export interface SenseMessage {
    id: string;
    candidateId: string;
    content: string;
    direction: 'inbound' | 'outbound';
    timestamp: string;
    status: 'sent' | 'delivered' | 'read' | 'opted-out';
}

export interface RingCentralCall {
    id: string;
    recruiterId: string;
    duration: number;
    timestamp: string;
    notes?: string;
    transcript?: string;
}

// AI Assistant Types
export interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    intent?: string;
    actions?: MessageAction[];
}

export interface MessageAction {
    label: string;
    action: string;
    data?: any;
}

export interface NaturalLanguageIntent {
    intent: string;
    entities: { [key: string]: any };
    confidence: number;
}

// Audit & Security Types
export interface AuditEvent {
    id: string;
    userId: string;
    action: string;
    payload: any;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface UserRole {
    id: string;
    name: 'recruiter' | 'manager' | 'admin';
    permissions: string[];
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
export type AppView = 'dashboard' | 'candidates' | 'todos' | 'issues' | 'social' | 'learning' | 'coaching' | 'integrations';

export interface NavigationItem {
    id: AppView;
    label: string;
    icon: string;
    phase: 1 | 2 | 3;
    description?: string;
}

// Time Period Types
export type TimePeriod = 'daily' | 'weekly' | 'monthly';

// Filter Types
export interface CandidateFilter {
    specialty?: string;
    location?: string;
    readinessScore?: { min: number; max: number };
    statusTag?: string;
    availableIn?: string; // e.g., "2 weeks"
}

export interface TodoFilter {
    assignee?: 'mine' | 'assigned-to-me' | 'all';
    status?: ToDo['status'];
    priority?: ToDo['priority'];
    dueDate?: 'today' | 'this-week' | 'overdue';
}

export interface IssueFilter {
    state?: Issue['state'];
    tags?: string[];
    priority?: Issue['priority'];
    assignedTo?: string;
}