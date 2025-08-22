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
    const [jobText, setJobText] = useState<string>('');
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
        
        // If no job details from screenshot, use default sample data
        const detailsToUse = jobDetails || {
            jobTitle: "Travel RN",
            specialty: "Med Surg",
            city: "Mesa",
            state: "AZ",
            payRate: "$3,344/week",
            duration: "13 weeks",
            jobType: "Travel",
            startDate: "07/29/2024"
        };
        
        // Set the job details if they weren't already set
        if (!jobDetails) {
            setJobDetails(detailsToUse);
        }

        setIsLoading(true);
        setError(null);
        setSocialPosts(null);
        setCityImage(null);
        setIsModalOpen(false);

        try {
            setLoadingMessage('Step 1/2: Generating social media campaign...');
            const { cityImage, socialPosts } = await generateCampaign({ 
                jobDetails: detailsToUse, 
                recruiterInfo, 
                toneState 
            });
            
            setCityImage(`data:image/svg+xml;base64,${cityImage}`);
            setSocialPosts(socialPosts);
            
            setLoadingMessage('Step 2/2: All done!');
            setIsLoading(false);
            setIsModalOpen(true);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred. Check the console for details.");
            setLoadingMessage("Campaign generation failed.");
            setIsLoading(false);
        }
    }, [jobDetails, recruiterInfo, toneState]);

    const handleAnalyzeJobText = useCallback(async () => {
        if (!jobText.trim()) {
            setError("Please enter job details to analyze.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setLoadingMessage('Analyzing job details...');

        try {
            // Mock job parsing from text
            const details = await parseJobDetailsFromText(jobText);
            setJobDetails(details);
            setLoadingMessage('Job details analyzed successfully!');
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to analyze job details.");
            setLoadingMessage('Analysis failed.');
            setIsLoading(false);
        }
    }, [jobText]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Generator</h1>
                <p className="text-gray-600">Create engaging social media campaigns from job descriptions</p>
            </div>

            {/* Job Text Input */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <label htmlFor="job-description" className="block text-lg font-medium text-gray-800 mb-1">
                    Paste Job Details
                </label>
                <p className="text-sm text-gray-500 mb-3">
                    Paste job details here, or use the default sample data to test the generator.
                </p>
                <textarea
                    id="job-description"
                    rows={8}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                    placeholder="Paste job details here, or leave blank to use sample data..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    disabled={isLoading}
                />
                <div className="mt-4">
                    <button
                        onClick={handleAnalyzeJobText}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mr-4"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Job Details'}
                    </button>
                    <span className="text-sm text-gray-500">
                        Or skip this step and use sample data below
                    </span>
                </div>
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

            {jobDetails && (
                <JobDetailsDisplay
                    jobDetails={jobDetails}
                    setJobDetails={setJobDetails}
                    isLoading={isLoading}
                />
            )}
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
                <button
                    onClick={handleGenerateCampaign}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
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
                <p className="text-sm font-medium text-primary-700 h-5">
                    {isLoading ? loadingMessage : 'Ready to generate your campaign with sample or custom data'}
                </p>
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

// Mock function to parse job details from text
const parseJobDetailsFromText = async (text: string): Promise<JobDetails> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple text parsing logic (in production, this would be more sophisticated)
    const lines = text.toLowerCase().split('\n');
    
    let jobTitle = "Travel RN";
    let specialty = "Med Surg";
    let city = "Mesa";
    let state = "AZ";
    let payRate = "$3,344/week";
    let duration = "13 weeks";
    let jobType = "Travel";
    let startDate = "07/29/2024";
    
    // Extract information from text if available
    lines.forEach(line => {
        if (line.includes('specialty:') || line.includes('discipline:')) {
            const match = line.match(/(?:specialty|discipline):\s*(.+)/);
            if (match) specialty = match[1].trim();
        }
        if (line.includes('location:') || line.includes('city:')) {
            const match = line.match(/(?:location|city):\s*(.+)/);
            if (match) {
                const location = match[1].trim();
                const parts = location.split(',');
                if (parts.length >= 2) {
                    city = parts[0].trim();
                    state = parts[1].trim();
                }
            }
        }
        if (line.includes('pay') || line.includes('rate') || line.includes('weekly')) {
            const match = line.match(/\$[\d,]+/);
            if (match) payRate = match[0] + '/week';
        }
        if (line.includes('duration') || line.includes('weeks')) {
            const match = line.match(/(\d+)\s*weeks?/);
            if (match) duration = match[1] + ' weeks';
        }
        if (line.includes('start date') || line.includes('start:')) {
            const match = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
            if (match) startDate = match[1];
        }
    });
    
    return {
        jobTitle,
        specialty,
        city,
        state,
        payRate,
        duration,
        jobType,
        startDate
    };
};

export default SocialMediaView;
            
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