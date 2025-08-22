import React, { useState } from 'react';
import { IntegrationAdapter } from '../types';

interface IntegrationsViewProps {
    integrations: IntegrationAdapter[];
    setIntegrations: (integrations: IntegrationAdapter[]) => void;
}

const integrationConfigs = {
    nexus: {
        name: 'Nexus ATS',
        description: 'Read submissions, placements, candidate profiles; write notes/links',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'bg-blue-500',
        features: ['Candidate profiles', 'Submission tracking', 'Placement status', 'Notes sync']
    },
    sense: {
        name: 'Sense SMS',
        description: 'Send messages, track campaigns, monitor opt-out rates',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        color: 'bg-green-500',
        features: ['SMS campaigns', 'Message templates', 'Opt-out tracking', 'Response rates']
    },
    ringcentral: {
        name: 'RingCentral',
        description: 'Call counts, durations, transcripts, and AI-generated notes',
        icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
        color: 'bg-orange-500',
        features: ['Call tracking', 'Duration metrics', 'AI transcripts', 'Call recordings']
    },
    outlook: {
        name: 'Outlook 365',
        description: 'Send emails, read threads, summarize conversations by candidate',
        icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'bg-blue-600',
        features: ['Email drafting', 'Thread summaries', 'Calendar integration', 'Contact sync']
    },
    teams: {
        name: 'Microsoft Teams',
        description: 'Bot commands, reminders, adaptive cards for daily scorecards',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        color: 'bg-purple-500',
        features: ['Bot commands', 'Task reminders', 'Daily scorecards', 'Team notifications']
    },
    linkedin: {
        name: 'LinkedIn',
        description: 'Deep-link helpers and candidate sourcing integration',
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        color: 'bg-blue-700',
        features: ['Profile deep-links', 'Sourcing helpers', 'Connection tracking', 'Message templates']
    }
};

const IntegrationCard: React.FC<{
    integration: IntegrationAdapter;
    config: typeof integrationConfigs[keyof typeof integrationConfigs];
    onToggle: (name: IntegrationAdapter['name']) => void;
    onConfigure: (name: IntegrationAdapter['name']) => void;
}> = ({ integration, config, onToggle, onConfigure }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${config.color} mr-4`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${integration.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm font-medium ${integration.connected ? 'text-green-600' : 'text-gray-500'}`}>
                        {integration.connected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="grid grid-cols-2 gap-2">
                    {config.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            {integration.lastSync && (
                <div className="mb-4 text-xs text-gray-500">
                    Last sync: {new Date(integration.lastSync).toLocaleString()}
                </div>
            )}

            <div className="flex space-x-3">
                <button
                    onClick={() => onToggle(integration.name)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        integration.connected
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
                
                {integration.connected && (
                    <button
                        onClick={() => onConfigure(integration.name)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        Configure
                    </button>
                )}
            </div>
        </div>
    );
};

const IntegrationsView: React.FC<IntegrationsViewProps> = ({ integrations, setIntegrations }) => {
    const [showConfigModal, setShowConfigModal] = useState<string | null>(null);

    const handleToggleIntegration = (name: IntegrationAdapter['name']) => {
        setIntegrations(integrations.map(integration => 
            integration.name === name 
                ? { 
                    ...integration, 
                    connected: !integration.connected,
                    lastSync: integration.connected ? undefined : new Date().toISOString()
                  }
                : integration
        ));
    };

    const handleConfigureIntegration = (name: IntegrationAdapter['name']) => {
        setShowConfigModal(name);
    };

    const connectedIntegrations = integrations.filter(i => i.connected);
    const availableIntegrations = integrations.filter(i => !i.connected);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-600">Connect your existing tools to the AI Recruiter Assistant</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</div>
                    <div className="text-sm text-gray-600">Connected</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">{availableIntegrations.length}</div>
                    <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
                    <div className="text-sm text-gray-600">Total Integrations</div>
                </div>
            </div>

            {/* Integration Overview */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Integration Strategy</h2>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">
                    The AI Recruiter Assistant works <strong>alongside</strong> your existing tools, not replacing them. 
                    Connect your ATS, communication tools, and sourcing platforms to create a unified command center.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Phase 1 (MVP)</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Nexus ATS for candidate data</li>
                            <li>• RingCentral for call metrics</li>
                            <li>• Sense for SMS campaigns</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Phase 2 & 3</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Outlook for email integration</li>
                            <li>• Teams for bot commands</li>
                            <li>• LinkedIn for sourcing helpers</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration) => (
                    <IntegrationCard
                        key={integration.name}
                        integration={integration}
                        config={integrationConfigs[integration.name]}
                        onToggle={handleToggleIntegration}
                        onConfigure={handleConfigureIntegration}
                    />
                ))}
            </div>

            {/* Configuration Modal */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Configure {integrationConfigs[showConfigModal as keyof typeof integrationConfigs].name}
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        API Endpoint
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="https://api.example.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        API Key
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Enter API key"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sync Frequency
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                        <option value="realtime">Real-time</option>
                                        <option value="5min">Every 5 minutes</option>
                                        <option value="15min">Every 15 minutes</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfigModal(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowConfigModal(null)}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegrationsView;