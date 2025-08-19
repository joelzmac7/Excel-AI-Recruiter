import { JobDetails, SocialPosts, RecruiterInfo } from '../types';

const API_BASE_URL = ''; // Relative path to use the same host

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const parseJobDetailsFromImage = async (imageBase64: string): Promise<JobDetails> => {
    const response = await fetch(`${API_BASE_URL}/api/parse-job-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
    });
    return handleResponse(response);
};

interface CampaignPayload {
    jobDetails: JobDetails;
    recruiterInfo: RecruiterInfo;
    toneState: string;
}

interface CampaignResponse {
    cityImage: string;
    socialPosts: SocialPosts;
}

export const generateCampaign = async (payload: CampaignPayload): Promise<CampaignResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/generate-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

// The functions below are deprecated as their logic is now on the server.
// They are kept here to prevent breaking changes if they were referenced elsewhere,
// but they should not be used.

export const generateCityCollage = async (details: JobDetails): Promise<string> => {
    console.warn("generateCityCollage is deprecated. Use generateCampaign instead.");
    throw new Error("This function is deprecated and should not be called from the client.");
};

export const generateSocialPosts = async (details: JobDetails, recruiterInfo: RecruiterInfo, toneState: string): Promise<SocialPosts> => {
    console.warn("generateSocialPosts is deprecated. Use generateCampaign instead.");
    throw new Error("This function is deprecated and should not be called from the client.");
};
