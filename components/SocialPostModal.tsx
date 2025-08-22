import React, { useState, useEffect } from 'react';
import { JobDetails, SocialPosts, EmailVariation } from '../types';

type SocialPlatform = keyof Omit<SocialPosts, 'thingsToDo' | 'placesToStay'>;
type ToDoCategory = 'single' | 'couple' | 'family';
type StayCategory = 'rvParks' | 'hotels' | 'travelerHousing';
type AllTabs = SocialPlatform | 'thingsToDo' | 'placesToStay';

interface SocialPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: string | null;
    posts: SocialPosts;
    details: JobDetails;
    companyLogoUrl: string;
    companyName: string;
}

const platformNames: Record<AllTabs, string> = {
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    x: 'X (Twitter)',
    sms: 'SMS',
    email: 'Email',
    thingsToDo: 'Things to Do',
    placesToStay: 'Places to Stay'
};

const CopyButton: React.FC<{ textToCopy: string, label?: string }> = ({ textToCopy, label = "Copy" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className={`w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                copied
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
        >
            {copied ? 'Copied!' : label}
        </button>
    );
};

const ThingsToDoPanel: React.FC<{ activities: SocialPosts['thingsToDo'], details: JobDetails }> = ({ activities, details }) => {
    const [category, setCategory] = useState<ToDoCategory>('single');
    
    const categoryLabels: Record<ToDoCategory, string> = {
        single: "For a Single Person",
        couple: "For a Couple",
        family: "For a Family"
    };

    const currentActivities = activities[category] || [];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-baseline justify-between mb-4">
                 <h3 className="font-bold text-lg text-gray-700">Top 10 Things to Do in {details.city}</h3>
                 <div className="flex items-center rounded-lg p-0.5 bg-gray-100 border">
                    {(Object.keys(categoryLabels) as ToDoCategory[]).map(cat => (
                         <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${category === cat ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
             <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-800">
                <strong className="font-semibold">{categoryLabels[category]}</strong> &ndash; a curated list of seasonal activities.
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    {currentActivities.length > 0 ? currentActivities.map((activity, index) => (
                        <li key={index} className="pl-2 text-sm leading-relaxed border-l-2 border-primary-100">
                            {activity}
                        </li>
                    )) : <p>No activities found for this category.</p>}
                </ol>
            </div>
        </div>
    );
};

const PlacesToStayPanel: React.FC<{ housing: SocialPosts['placesToStay'], details: JobDetails }> = ({ housing, details }) => {
    const [category, setCategory] = useState<StayCategory>('travelerHousing');
    
    const categoryLabels: Record<StayCategory, string> = {
        travelerHousing: "Traveler Housing",
        hotels: "Hotels",
        rvParks: "RV Parks"
    };
    
    const categoryDescriptions: Record<StayCategory, string> = {
        travelerHousing: "Sites and services specializing in furnished, mid-term rentals for professionals.",
        hotels: "Recommended hotels, especially those suitable for extended stays.",
        rvParks: "Nearby parks and sites for travelers with recreational vehicles."
    };

    const currentStays = housing[category] || [];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-baseline justify-between mb-4">
                 <h3 className="font-bold text-lg text-gray-700">Places to Stay Near {details.city}</h3>
                 <div className="flex items-center rounded-lg p-0.5 bg-gray-100 border">
                    {(Object.keys(categoryLabels) as StayCategory[]).map(cat => (
                         <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${category === cat ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                            {categoryLabels[cat]}
                        </button>
                    ))}
                </div>
            </div>
             <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-800">
                <strong className="font-semibold">{categoryLabels[category]}:</strong> {categoryDescriptions[category]}
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <ul className="space-y-3 list-disc list-inside text-gray-700">
                    {currentStays.length > 0 ? currentStays.map((place, index) => (
                        <li key={index} className="pl-2 text-sm leading-relaxed border-l-2 border-primary-100">
                            {place}
                        </li>
                    )) : <p>No recommendations found for this category.</p>}
                </ul>
            </div>
        </div>
    );
};

const getShareLink = (platform: SocialPlatform, content: string | EmailVariation, companyUrl: string): string => {
    const text = typeof content === 'string' ? content : (content as EmailVariation).body;
    const encodedText = encodeURIComponent(text);

    switch (platform) {
        case 'linkedin':
            return `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(companyUrl)}&quote=${encodedText}`;
        case 'x':
            return `https://twitter.com/intent/tweet?text=${encodedText}`;
        case 'sms':
            return `sms:?&body=${encodedText}`; // & is for iOS compatibility
        case 'email':
            const subject = encodeURIComponent((content as EmailVariation).subject);
            return `mailto:?subject=${subject}&body=${encodedText}`;
        default:
            return '#';
    }
};

const SocialPostPanel: React.FC<{ platform: SocialPlatform; content: SocialPosts[SocialPlatform]; companyUrl: string }> = ({ platform, content, companyUrl }) => (
    <div className="flex flex-col h-full">
        <h3 className="font-bold text-lg text-gray-700 mb-2">{platformNames[platform]} Post Options</h3>
        {content?.strategy && (
             <div className="mb-4 p-4 bg-primary-50 border-l-4 border-primary-400" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-primary-800">Expert Strategy</p>
                        <p className="text-sm text-primary-700">{content.strategy}</p>
                    </div>
                </div>
            </div>
        )}
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
            {content && content.variations.length > 0 ? (
                (content.variations as Array<string | EmailVariation>).map((post, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-sm hover:border-primary-200">
                        {platform === 'email' ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-800 text-sm flex-grow"><strong className="font-semibold text-gray-600">Subject:</strong> {(post as EmailVariation).subject}</p>
                                    <CopyButton textToCopy={(post as EmailVariation).subject} label="Copy Subject" />
                                </div>
                                <hr />
                                <div className="flex justify-between items-start gap-3">
                                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap flex-grow">{(post as EmailVariation).body}</p>
                                     <div className="flex-shrink-0 flex flex-col gap-2">
                                        <CopyButton textToCopy={(post as EmailVariation).body} label="Copy Body" />
                                        <a
                                            href={getShareLink('email', post as EmailVariation, companyUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                                platform === 'sms' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                platform === 'x' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                            aria-label={`Open in ${platform === 'sms' ? 'Sense' : platform === 'x' ? 'X' : platformNames[platform]}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                                            {platform === 'sms' ? 'Open in Sense' : 
                                             platform === 'x' ? 'Share on X' : 
                                             `Open in ${platformNames[platform]}`}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start gap-3">
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap flex-grow">{post as string}</p>
                                <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2">
                                    <CopyButton textToCopy={post as string} />
                                    <a
                                        href={getShareLink(platform, post as string, companyUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center gap-1.5"
                                        aria-label={`Share on ${platformNames[platform]}`}
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                                        Share
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm p-3">No post variations were generated for this platform.</p>
            )}
        </div>
    </div>
);


const SocialPostModal: React.FC<SocialPostModalProps> = ({ isOpen, onClose, image, posts, details, companyLogoUrl, companyName }) => {
    const [activeTab, setActiveTab] = useState<AllTabs>('linkedin');
    const companyUrl = new URL(companyLogoUrl).origin;

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                     <div className="flex items-center gap-4">
                        <img src={companyLogoUrl} alt={`${companyName} Logo`} className="h-12 w-auto" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{details.jobTitle} - {details.specialty}</h2>
                            <p className="text-sm text-gray-500">{details.city}, {details.state} | {details.payRate} | {details.duration} | Starts: {details.startDate}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </header>

                <div className="flex-grow flex flex-col md:flex-row overflow-y-auto min-h-0">
                    <div className="w-full md:w-3/5 p-5 flex flex-col border-r border-gray-200">
                         <div className="border-b border-gray-200 mb-4">
                            <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                                {(Object.keys(platformNames) as AllTabs[]).map((tabKey) => (
                                    <button
                                        key={tabKey}
                                        onClick={() => setActiveTab(tabKey)}
                                        className={`flex-shrink-0 whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tabKey
                                                ? 'border-primary-500 text-primary-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        role="tab"
                                        aria-selected={activeTab === tabKey}
                                    >
                                        {platformNames[tabKey]}
                                    </button>
                                ))}
                            </nav>
                        </div>
                         <div className="flex-grow flex flex-col min-h-0" role="tabpanel">
                             {activeTab === 'thingsToDo' ? (
                                <ThingsToDoPanel activities={posts.thingsToDo} details={details} />
                            ) : activeTab === 'placesToStay' ? (
                                <PlacesToStayPanel housing={posts.placesToStay} details={details} />
                            ) : (
                                <SocialPostPanel platform={activeTab} content={posts[activeTab]} companyUrl={companyUrl} />
                            )}
                        </div>
                    </div>
                   
                    <div className="w-full md:w-2/5 p-5 bg-gray-100 flex flex-col justify-center items-center">
                        <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                            {image ? (
                                <img src={image} alt={`AI-generated lifestyle collage for ${details.city}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                         <p className="text-xs text-gray-500 mt-2 text-center">AI-generated lifestyle collage for {details.city}, {details.state}.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPostModal;