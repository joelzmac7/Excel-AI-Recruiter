import React, { useState, useRef, useEffect } from 'react';
import { RecruiterInfo, AppView, PipelineMetrics, CandidateBookmark, ToDo, Issue } from '../types';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    recruiterInfo: RecruiterInfo;
    currentView: AppView;
    contextData: {
        metrics: PipelineMetrics;
        candidates: CandidateBookmark[];
        todos: ToDo[];
        issues: Issue[];
    };
}

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: Array<{
        label: string;
        action: string;
    }>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, recruiterInfo, currentView, contextData }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: `Hi ${recruiterInfo.name}! I'm your AI recruiting assistant. I can help you with tasks like drafting messages, analyzing your pipeline, managing to-dos, and more. What would you like to work on?`,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(content, currentView, contextData, recruiterInfo);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                timestamp: new Date(),
                actions: response.actions
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    const handleAction = (action: string) => {
        // In a real implementation, this would trigger the specific action
        alert(`Action triggered: ${action}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
                    <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                            <p className="text-sm text-gray-600">Context: {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.type === 'user' 
                                    ? 'bg-primary-600 text-white' 
                                    : 'bg-gray-100 text-gray-900'
                            }`}>
                                <p className="text-sm">{message.content}</p>
                                {message.actions && (
                                    <div className="mt-2 space-y-1">
                                        {message.actions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAction(action.action)}
                                                className="block w-full text-left px-2 py-1 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs opacity-75 mt-1">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleVoiceInput}
                            disabled={isListening}
                            className={`p-2 rounded-lg transition-colors ${
                                isListening 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        
                        <button
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim() || isTyping}
                            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// AI Response Generator
function generateAIResponse(
    input: string, 
    currentView: AppView, 
    contextData: any, 
    recruiterInfo: RecruiterInfo
): { content: string; actions?: Array<{ label: string; action: string }> } {
    const lowerInput = input.toLowerCase();

    // Context-aware responses based on current view
    if (currentView === 'dashboard') {
        if (lowerInput.includes('metric') || lowerInput.includes('performance')) {
            return {
                content: `Based on your current metrics, you're at ${contextData.metrics.calls.current}/${contextData.metrics.calls.goal} calls today. Your submission rate is strong, but I notice you could boost your pipeline count. Would you like me to help draft some outreach messages?`,
                actions: [
                    { label: 'Draft LinkedIn Messages', action: 'draft_linkedin' },
                    { label: 'Create Call List', action: 'create_call_list' }
                ]
            };
        }
    }

    if (currentView === 'candidates') {
        if (lowerInput.includes('message') || lowerInput.includes('text') || lowerInput.includes('email')) {
            return {
                content: `I can help you draft personalized messages for your candidates. What type of message do you need? I can create texts for follow-ups, job opportunities, or check-ins based on their specialty and location.`,
                actions: [
                    { label: 'Draft Follow-up Text', action: 'draft_followup' },
                    { label: 'Create Job Opportunity Email', action: 'draft_job_email' },
                    { label: 'Send via Sense', action: 'send_sense' }
                ]
            };
        }
    }

    if (currentView === 'todos') {
        if (lowerInput.includes('todo') || lowerInput.includes('task') || lowerInput.includes('remind')) {
            return {
                content: `You have ${contextData.todos.filter((t: ToDo) => !t.completed).length} pending tasks. I can help you prioritize them or create new ones. What would you like to focus on?`,
                actions: [
                    { label: 'Show Overdue Tasks', action: 'show_overdue' },
                    { label: 'Create New Task', action: 'create_task' }
                ]
            };
        }
    }

    // General responses
    if (lowerInput.includes('draft') && lowerInput.includes('text')) {
        return {
            content: `I'd be happy to help you draft a text message! For the best results, tell me:
            1. Who is the candidate (specialty/location)?
            2. What's the purpose (follow-up, new opportunity, check-in)?
            3. Any specific details to include?
            
            For example: "Draft a text for an ICU RN in Dallas about a new 13-week assignment."`,
            actions: [
                { label: 'Use Template: Follow-up', action: 'template_followup' },
                { label: 'Use Template: New Job', action: 'template_newjob' }
            ]
        };
    }

    if (lowerInput.includes('submission') || lowerInput.includes('submit')) {
        return {
            content: `I can see you have ${contextData.candidates.filter((c: CandidateBookmark) => c.status === 'Ready to Submit').length} candidates ready to submit. Would you like me to help prioritize them or draft submission emails?`,
            actions: [
                { label: 'Show Ready Candidates', action: 'show_ready' },
                { label: 'Draft Submission Email', action: 'draft_submission' }
            ]
        };
    }

    if (lowerInput.includes('pipeline') || lowerInput.includes('candidates')) {
        return {
            content: `Your current pipeline has ${contextData.candidates.length} candidates. Here's the breakdown:
            - ${contextData.candidates.filter((c: CandidateBookmark) => c.status === 'Hot Lead').length} Hot Leads
            - ${contextData.candidates.filter((c: CandidateBookmark) => c.status === 'Ready to Submit').length} Ready to Submit
            - ${contextData.candidates.filter((c: CandidateBookmark) => c.status === 'In Process').length} In Process
            
            What would you like to focus on?`,
            actions: [
                { label: 'Focus on Hot Leads', action: 'focus_hot_leads' },
                { label: 'Review Ready to Submit', action: 'review_ready' }
            ]
        };
    }

    // Default responses
    const defaultResponses = [
        `I can help you with various recruiting tasks! Try asking me to:
        • "Draft a text for an ICU RN in Phoenix"
        • "Show me my submissions this week"
        • "Remind me of my to-dos due today"
        • "Log an issue about credentialing delays"`,
        
        `As your AI assistant, I'm here to help streamline your recruiting workflow. I can draft messages, analyze your pipeline, manage tasks, and provide insights. What would you like to work on?`,
        
        `I'm context-aware of your current data and can provide personalized assistance. Whether you need help with candidate outreach, pipeline management, or task organization, just let me know!`
    ];

    return {
        content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
}

export default AIAssistant;