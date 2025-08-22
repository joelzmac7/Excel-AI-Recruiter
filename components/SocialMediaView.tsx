import React, { useState, useCallback, useEffect } from 'react';
import { JobDetails, SocialPosts, RecruiterInfo } from '../types';
import { parseJobDetailsFromImage, generateCampaign } from '../services/geminiService';
import RecruiterInfoInput from './RecruiterInfoInput';
import SocialPostModal from './SocialPostModal';
import { ToneSelector } from './ToneSelector';
import { COMPANY_LOGO_URL, COMPANY_NAME } from '../constants';
import JobDetailsDisplay from './JobDetailsDisplay';
import { Spinner } from './ui/Spinner';

const SocialMediaView: React.FC = () => {
    const [recruiterInfo, setRecruiterInfo] = useState<RecruiterInfo>({ name: '', email: '', phone: '' });
    const [toneState, setToneState] = useState<string>('Default');
    const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
    const [socialPosts, setSocialPosts] = useState<SocialPosts | null>(null);
    const [cityImage, setCityImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Generator</h1>
                <p className="text-gray-600">Create engaging social media campaigns from job descriptions</p>
            </div>

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
                <p className="text-sm font-medium text-primary-700 h-5">{isLoading ? loadingMessage : (jobDetails ? 'Ready to generate your campaign.' : 'Waiting for job details...')}</p>
            </div>

            {error && (
                <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

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

export default SocialMediaView;