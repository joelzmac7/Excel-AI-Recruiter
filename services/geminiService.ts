import { JobDetails, SocialPosts, RecruiterInfo } from '../types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (will be configured when user connects)
let supabase: any = null;

const initSupabase = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('supabase')) {
        // Auto-detect Supabase environment
        const supabaseUrl = `https://${window.location.hostname.split('.')[0]}.supabase.co`;
        const supabaseKey = 'your-anon-key'; // This will be replaced when user connects
        supabase = createClient(supabaseUrl, supabaseKey);
    }
};

// Mock AI responses for now (can be enhanced with Supabase Edge Functions later)
export const parseJobDetailsFromImage = async (imageBase64: string): Promise<JobDetails> => {
    // Mock parsing for now - in production this would use Supabase Edge Functions
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    
    return {
        jobTitle: "Travel RN",
        specialty: "Med Surg",
        city: "Mesa",
        state: "AZ",
        payRate: "$3,344/week",
        duration: "13 weeks",
        jobType: "Travel",
        startDate: "07/29/2024"
    };
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
    // Mock campaign generation - in production this would use Supabase Edge Functions
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing
    
    const mockSocialPosts: SocialPosts = {
        linkedin: {
            variations: [
                `🏥 Exciting ${payload.jobDetails.jobTitle} opportunity in ${payload.jobDetails.city}, ${payload.jobDetails.state}!\n\n💰 Competitive pay: ${payload.jobDetails.payRate}\n📅 ${payload.jobDetails.duration} assignment\n🎯 ${payload.jobDetails.specialty} specialty\n\nReady to advance your career? Contact ${payload.recruiterInfo.name} at ${payload.recruiterInfo.email} or ${payload.recruiterInfo.phone}!\n\n#TravelNurse #${payload.jobDetails.specialty.replace(' ', '')} #HealthcareJobs`
            ],
            strategy: "Professional tone highlighting career advancement and competitive compensation"
        },
        facebook: {
            variations: [
                `🌟 Amazing ${payload.jobDetails.jobTitle} opportunity in beautiful ${payload.jobDetails.city}!\n\nWhat we're offering:\n✅ ${payload.jobDetails.payRate} weekly\n✅ ${payload.jobDetails.duration} assignment\n✅ ${payload.jobDetails.specialty} experience\n✅ Start date: ${payload.jobDetails.startDate}\n\nInterested? Message ${payload.recruiterInfo.name} today!\n📧 ${payload.recruiterInfo.email}\n📱 ${payload.recruiterInfo.phone}`
            ],
            strategy: "Friendly, benefit-focused approach with clear call-to-action"
        },
        instagram: {
            variations: [
                `✨ Your next adventure awaits in ${payload.jobDetails.city}! ✨\n\n${payload.jobDetails.jobTitle} | ${payload.jobDetails.specialty}\n💵 ${payload.jobDetails.payRate}\n📍 ${payload.jobDetails.city}, ${payload.jobDetails.state}\n⏰ ${payload.jobDetails.duration}\n\nDM ${payload.recruiterInfo.name} for details! 💬\n\n#TravelNurse #Adventure #${payload.jobDetails.city} #HealthcareHeroes`
            ],
            strategy: "Visual, adventure-focused content with lifestyle appeal"
        },
        x: {
            variations: [
                `🚨 ${payload.jobDetails.jobTitle} needed in ${payload.jobDetails.city}!\n\n💰 ${payload.jobDetails.payRate}\n📅 ${payload.jobDetails.duration}\n🏥 ${payload.jobDetails.specialty}\n\nApply now: ${payload.recruiterInfo.email}\n\n#TravelNurse #${payload.jobDetails.specialty.replace(' ', '')} #Hiring`
            ],
            strategy: "Concise, urgent tone with hashtags for discoverability"
        },
        sms: {
            variations: [
                `Hi! ${payload.jobDetails.jobTitle} opportunity in ${payload.jobDetails.city} - ${payload.jobDetails.payRate}, ${payload.jobDetails.duration}. ${payload.jobDetails.specialty} experience needed. Interested? Call ${payload.recruiterInfo.name} at ${payload.recruiterInfo.phone}`
            ],
            strategy: "Direct, personal approach with immediate contact information"
        },
        email: {
            variations: [
                {
                    subject: `${payload.jobDetails.jobTitle} Opportunity - ${payload.jobDetails.city}, ${payload.jobDetails.state} | ${payload.jobDetails.payRate}`,
                    body: `Dear Healthcare Professional,\n\nI hope this email finds you well. I'm ${payload.recruiterInfo.name} with Excel Medical Staffing, and I have an exciting ${payload.jobDetails.jobTitle} opportunity that I believe would be perfect for you.\n\nPosition Details:\n• Role: ${payload.jobDetails.jobTitle} - ${payload.jobDetails.specialty}\n• Location: ${payload.jobDetails.city}, ${payload.jobDetails.state}\n• Duration: ${payload.jobDetails.duration}\n• Weekly Pay: ${payload.jobDetails.payRate}\n• Start Date: ${payload.jobDetails.startDate}\n\nThis is an excellent opportunity to advance your career while exploring a new location. ${payload.jobDetails.city} offers great amenities and a welcoming healthcare community.\n\nIf you're interested or would like more information, please don't hesitate to reach out:\n\n${payload.recruiterInfo.name}\n${payload.recruiterInfo.email}\n${payload.recruiterInfo.phone}\n\nBest regards,\n${payload.recruiterInfo.name}\nExcel Medical Staffing`
                }
            ],
            strategy: "Professional, detailed email with complete job information and personal touch"
        },
        thingsToDo: {
            single: [
                "Visit Desert Botanical Garden",
                "Explore Old Town Scottsdale",
                "Hike Camelback Mountain",
                "Tour Musical Instrument Museum",
                "Visit Phoenix Art Museum",
                "Explore Papago Park",
                "Visit Heard Museum",
                "Take a hot air balloon ride",
                "Explore South Mountain Park",
                "Visit Arizona Science Center"
            ],
            couple: [
                "Romantic dinner in Old Town Scottsdale",
                "Couples spa day at a resort",
                "Wine tasting in Carefree",
                "Sunset hike at South Mountain",
                "Concert at Talking Stick Resort Arena",
                "Golf at TPC Scottsdale",
                "Visit Butterfly Wonderland",
                "Take a scenic drive to Sedona",
                "Explore Roosevelt Row arts district",
                "Dinner cruise on Tempe Town Lake"
            ],
            family: [
                "Phoenix Zoo visit",
                "Arizona Science Center exploration",
                "Castles N' Coasters amusement park",
                "Swimming at Big Surf Waterpark",
                "Family hiking at Hole-in-the-Rock",
                "Visit OdySea Aquarium",
                "Explore Children's Museum of Phoenix",
                "Picnic at Steele Indian School Park",
                "Visit Wildlife World Zoo",
                "Family fun at Topgolf"
            ]
        },
        placesToStay: {
            travelerHousing: [
                "Furnished Finder - Mesa locations",
                "Travel Nurse Housing - Phoenix area",
                "Corporate Housing by Oakwood",
                "Extended Stay America - Mesa",
                "Blu Corporate Housing"
            ],
            hotels: [
                "Residence Inn Phoenix Mesa",
                "Homewood Suites by Hilton Phoenix-Mesa",
                "Hampton Inn & Suites Phoenix-Mesa",
                "Courtyard by Marriott Phoenix Mesa",
                "Holiday Inn Express Mesa"
            ],
            rvParks: [
                "Mesa Spirit RV Resort",
                "Countryside RV Resort",
                "Arizona RV Resort",
                "Mesa Regal RV Resort",
                "Good Life RV Resort"
            ]
        }
    };
    
    // Mock city image (base64 placeholder)
    const mockCityImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lc2EsIEFaPC90ZXh0Pgo8L3N2Zz4K";
    
    return {
        cityImage: mockCityImage,
        socialPosts: mockSocialPosts
    };
};

// Initialize Supabase when the module loads
initSupabase();
