import React, { useState, useCallback, useEffect } from 'react';
import { JobDetails, SocialPosts, RecruiterInfo } from './types';
import { parseJobDetailsFromImage, generateCampaign } from './services/geminiService';
import RecruiterInfoInput from './components/RecruiterInfoInput';
import SocialPostModal from './components/SocialPostModal';
import { ToneSelector } from './components/ToneSelector';
import { COMPANY_LOGO_URL, COMPANY_NAME } from './constants';
import JobDetailsDisplay from './components/JobDetailsDisplay';
import { Spinner } from './components/ui/Spinner';

const App: React.FC = () => {
    const [recruiterInfo, setRecruiterInfo] = useState<RecruiterInfo>({ name: '', email: '', phone: '' });
    const [toneState, setToneState] = useState<string>('Default');
    const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
    const [socialPosts, setSocialPosts] = useState<SocialPosts | null>(null);
    const [cityImage, setCityImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingMessage, setLoadingMessage] = useState<string>('Initializing: Waiting for screenshot from browser extension...');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isInsideIframe, setIsInsideIframe] = useState(false);

    useEffect(() => {
        setIsInsideIframe(window.self !== window.top);

        const handleRpaMessage = async (event: MessageEvent) => {
            const data = event.data;
            if (data && data.type === 'INIT_RECRUITER_APP' && data.payload) {
                if (data.payload.recruiterInfo) {
                    setRecruiterInfo(prevInfo => ({ ...prevInfo, ...data.payload.recruiterInfo }));
                }

                if (data.payload.screenshotBase64) {
                    try {
                        setError(null);
                        setIsLoading(true);
                        setLoadingMessage('Step 1/3: Analyzing job details from screenshot...');
                        const details = await parseJobDetailsFromImage(data.payload.screenshotBase64);
                        setJobDetails(details);
                        setLoadingMessage('Analysis complete. Please review the details below.');
                        setIsLoading(false);
                    } catch (err) {
                        console.error(err);
                        setError(err instanceof Error ? err.message : "An unknown error occurred during screenshot analysis.");
                        setLoadingMessage('Failed to analyze screenshot.');
                        setIsLoading(false);
                    }
                } else {
                     setError("No screenshot was received from the RPA script.");
                     setIsLoading(false);
                }
            }
        };

        window.addEventListener('message', handleRpaMessage);
        return () => window.removeEventListener('message', handleRpaMessage);
    }, []);


    const handleGenerateCampaign = useCallback(async () => {
        if (!recruiterInfo.name.trim() || !recruiterInfo.email.trim() || !recruiterInfo.phone.trim()) {
            setError("Please fill in your complete recruiter information.");
            return;
        }
        if (!jobDetails) {
            setError("Job details have not been analyzed yet.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSocialPosts(null);
        setCityImage(null);
        setIsModalOpen(false);

        try {
            setLoadingMessage('Step 2/3: Generating social media campaign...');
            const { cityImage, socialPosts } = await generateCampaign({ jobDetails, recruiterInfo, toneState });
            
            setCityImage(`data:image/jpeg;base64,${cityImage}`);
            setSocialPosts(socialPosts);
            
            setLoadingMessage('Step 3/3: All done!');
            setIsLoading(false);
            setIsModalOpen(true);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred. Check the console for details.");
            setLoadingMessage("Campaign generation failed.");
            setIsLoading(false);
        }
    }, [jobDetails, recruiterInfo, toneState]);

    const handleCloseApp = () => {
        window.parent.postMessage({ type: 'CLOSE_RECRUITER_APP' }, '*');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-8 flex flex-col items-center relative">
                    {isInsideIframe && (
                        <button
                            onClick={handleCloseApp}
                            className="absolute top-[-8px] right-[-8px] text-gray-400 hover:text-primary-600 transition-all rounded-full bg-white/50 hover:bg-white p-1"
                            aria-label="Close"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    )}
                    <img src={COMPANY_LOGO_URL} alt={`${COMPANY_NAME} Logo`} className="h-20 w-auto mb-4" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-primary-700">Social Post AI</h1>
                    <p className="mt-2 text-lg text-gray-600">Instantly create engaging social media campaigns from any job description.</p>
                </header>
                
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <RecruiterInfoInput
                        recruiterInfo={recruiterInfo}
                        setRecruiterInfo={setRecruiterInfo}
                        isLoading={isLoading}
                    />
                     <ToneSelector
                        selectedState={toneState}
                        setSelectedState={setToneState}
                        isLoading={isLoading}
                    />
                </div>

                {jobDetails && !isLoading && (
                    <JobDetailsDisplay
                        jobDetails={jobDetails}
                        setJobDetails={setJobDetails}
                        isLoading={isLoading}
                    />
                )}
                
                <div className="mt-8 flex flex-col items-center justify-center gap-4">
                    <button
                        onClick={handleGenerateCampaign}
                        disabled={isLoading || !jobDetails}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                        aria-live="polite"
                    >
                        {isLoading ? (
                            <>
                                <Spinner />
                                Processing...
                            </>
                        ) : (
                            'Create Social Media Campaign'
                        )}
                    </button>
                    <p className="text-sm font-medium text-primary-700 h-5">{isLoading ? loadingMessage : (jobDetails ? 'Ready to generate your campaign.' : 'Waiting for details...')}</p>
                </div>


                {error && (
                    <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>

            {isModalOpen && socialPosts && jobDetails && (
                <SocialPostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    image={cityImage}
                    posts={socialPosts}
                    details={jobDetails}
                    companyLogoUrl={COMPANY_LOGO_URL}
                    companyName={COMPANY_NAME}
                />
            )}
        </div>
    );
};

export default App;
