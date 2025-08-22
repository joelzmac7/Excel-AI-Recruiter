import { JobDetails, SocialPosts, RecruiterInfo } from '../types';

// Mock AI responses that work immediately without external APIs
export const parseJobDetailsFromImage = async (imageBase64: string): Promise<JobDetails> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return realistic mock job details
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
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { jobDetails, recruiterInfo, toneState } = payload;
    
    // Generate comprehensive social media content
    const socialPosts: SocialPosts = {
        linkedin: {
            variations: [
                `🏥 Exciting ${jobDetails.jobTitle} opportunity in ${jobDetails.city}, ${jobDetails.state}!\n\n💰 Competitive pay: ${jobDetails.payRate}\n📅 ${jobDetails.duration} assignment\n🎯 ${jobDetails.specialty} specialty\n🗓️ Start date: ${jobDetails.startDate}\n\nReady to advance your career? Contact ${recruiterInfo.name} today!\n📧 ${recruiterInfo.email}\n📱 ${recruiterInfo.phone}\n\n#TravelNurse #${jobDetails.specialty.replace(/\s+/g, '')} #HealthcareJobs #${jobDetails.city}`,
                
                `🌟 ${jobDetails.specialty} professionals - your dream assignment awaits!\n\nLocation: ${jobDetails.city}, ${jobDetails.state}\nRole: ${jobDetails.jobTitle}\nDuration: ${jobDetails.duration}\nCompensation: ${jobDetails.payRate}\n\nThis is more than just a job - it's your next career milestone! Join a team that values your expertise and supports your growth.\n\nInterested? Let's connect!\n${recruiterInfo.name}\n${recruiterInfo.email} | ${recruiterInfo.phone}\n\n#HealthcareCareers #TravelNursing #ProfessionalGrowth`
            ],
            strategy: "Professional tone highlighting career advancement and competitive compensation with clear contact information"
        },
        
        facebook: {
            variations: [
                `🌟 Amazing ${jobDetails.jobTitle} opportunity in beautiful ${jobDetails.city}!\n\nWhat we're offering:\n✅ ${jobDetails.payRate} weekly\n✅ ${jobDetails.duration} assignment\n✅ ${jobDetails.specialty} experience\n✅ Start date: ${jobDetails.startDate}\n✅ Full support throughout your assignment\n\nWhy choose us?\n• Competitive pay packages\n• 24/7 recruiter support\n• Housing assistance\n• Travel reimbursement\n\nReady for your next adventure? Message ${recruiterInfo.name} today!\n📧 ${recruiterInfo.email}\n📱 ${recruiterInfo.phone}\n\n#TravelNurse #${jobDetails.city} #HealthcareJobs`,
                
                `🏥 Calling all ${jobDetails.specialty} professionals!\n\n${jobDetails.city}, ${jobDetails.state} is calling your name! This ${jobDetails.duration} assignment offers:\n\n💵 ${jobDetails.payRate} (that's competitive pay!)\n🏖️ Amazing location to explore\n👥 Supportive healthcare team\n🎯 Professional growth opportunities\n\nDon't let this opportunity pass you by! Contact ${recruiterInfo.name} for all the details.\n\n${recruiterInfo.email} | ${recruiterInfo.phone}\n\n#TravelHealthcare #NursingJobs #${jobDetails.state}`
            ],
            strategy: "Friendly, benefit-focused approach with clear value propositions and personal recruiter connection"
        },
        
        instagram: {
            variations: [
                `✨ Your next adventure awaits in ${jobDetails.city}! ✨\n\n${jobDetails.jobTitle} | ${jobDetails.specialty}\n💵 ${jobDetails.payRate}\n📍 ${jobDetails.city}, ${jobDetails.state}\n⏰ ${jobDetails.duration}\n🗓️ Starts ${jobDetails.startDate}\n\nReady to make memories while advancing your career? 🚀\n\nDM ${recruiterInfo.name} for details! 💬\n\n#TravelNurse #Adventure #${jobDetails.city} #HealthcareHeroes #NurseLife #TravelLife #${jobDetails.specialty.replace(/\s+/g, '')}`,
                
                `🌵 ${jobDetails.city} vibes are calling! 🌵\n\nPicture this: You, thriving in your ${jobDetails.jobTitle} role, earning ${jobDetails.payRate}, and exploring everything ${jobDetails.city} has to offer! 🌟\n\n📋 ${jobDetails.specialty} specialty\n⏱️ ${jobDetails.duration} commitment\n💰 Competitive weekly pay\n\nSlide into my DMs for the full scoop! 📩\n${recruiterInfo.name}\n\n#TravelNurseLife #${jobDetails.city}Adventures #HealthcareProfessional #LivingMyBestLife`
            ],
            strategy: "Visual, adventure-focused content with lifestyle appeal and emoji-rich formatting"
        },
        
        x: {
            variations: [
                `🚨 ${jobDetails.jobTitle} needed in ${jobDetails.city}!\n\n💰 ${jobDetails.payRate}\n📅 ${jobDetails.duration}\n🏥 ${jobDetails.specialty}\n🗓️ Start: ${jobDetails.startDate}\n\nApply now: ${recruiterInfo.email}\nCall: ${recruiterInfo.phone}\n\n#TravelNurse #${jobDetails.specialty.replace(/\s+/g, '')} #Hiring #${jobDetails.city} #HealthcareJobs`,
                
                `⚡ URGENT: ${jobDetails.specialty} opportunity in ${jobDetails.city}!\n\n${jobDetails.payRate} | ${jobDetails.duration}\nStart: ${jobDetails.startDate}\n\nContact ${recruiterInfo.name}:\n📧 ${recruiterInfo.email}\n📱 ${recruiterInfo.phone}\n\n#NursingJobs #TravelHealthcare #${jobDetails.state} #HiringNow`
            ],
            strategy: "Concise, urgent tone with hashtags for discoverability and immediate contact information"
        },
        
        sms: {
            variations: [
                `Hi! ${jobDetails.jobTitle} opportunity in ${jobDetails.city} - ${jobDetails.payRate}, ${jobDetails.duration}. ${jobDetails.specialty} experience needed. Start ${jobDetails.startDate}. Interested? Call ${recruiterInfo.name} at ${recruiterInfo.phone}`,
                
                `${jobDetails.specialty} RN needed in ${jobDetails.city}! ${jobDetails.payRate} for ${jobDetails.duration}. Great facility, supportive team. Available? Text back or call ${recruiterInfo.phone}. -${recruiterInfo.name}`
            ],
            strategy: `Direct, personal approach with immediate contact information, adapted for ${toneState === 'Default' ? 'general American' : toneState} communication style`
        },
        
        email: {
            variations: [
                {
                    subject: `${jobDetails.jobTitle} Opportunity - ${jobDetails.city}, ${jobDetails.state} | ${jobDetails.payRate}`,
                    body: `Dear Healthcare Professional,\n\nI hope this email finds you well. I'm ${recruiterInfo.name} with Excel Medical Staffing, and I have an exciting ${jobDetails.jobTitle} opportunity that I believe would be perfect for you.\n\nPosition Details:\n• Role: ${jobDetails.jobTitle} - ${jobDetails.specialty}\n• Location: ${jobDetails.city}, ${jobDetails.state}\n• Duration: ${jobDetails.duration}\n• Weekly Pay: ${jobDetails.payRate}\n• Start Date: ${jobDetails.startDate}\n• Assignment Type: ${jobDetails.jobType}\n\nWhy This Opportunity Stands Out:\n• Competitive compensation package\n• Supportive healthcare environment\n• Professional growth opportunities\n• Beautiful location with great amenities\n\n${jobDetails.city} offers an excellent quality of life with numerous recreational activities, dining options, and cultural attractions. Whether you're interested in outdoor adventures, local cuisine, or comfortable housing options, this location has something for everyone.\n\nHousing & Logistics:\nWe provide comprehensive support including housing assistance, travel reimbursement, and 24/7 recruiter support throughout your assignment.\n\nNext Steps:\nIf you're interested or would like more information about this opportunity, please don't hesitate to reach out. I'm here to answer any questions and help make your next career move as smooth as possible.\n\nBest regards,\n\n${recruiterInfo.name}\nSenior Healthcare Recruiter\nExcel Medical Staffing\n📧 ${recruiterInfo.email}\n📱 ${recruiterInfo.phone}\n\nP.S. I also have information about local attractions and housing options in ${jobDetails.city} if you'd like to learn more about what makes this location special!`
                },
                {
                    subject: `Immediate Start Available: ${jobDetails.specialty} Position in ${jobDetails.city}`,
                    body: `Hello!\n\nI'm reaching out because I have a fantastic ${jobDetails.jobTitle} position that just became available in ${jobDetails.city}, ${jobDetails.state}.\n\nHere's what makes this opportunity special:\n\n🏥 Position: ${jobDetails.jobTitle} - ${jobDetails.specialty}\n📍 Location: ${jobDetails.city}, ${jobDetails.state}\n💰 Weekly Pay: ${jobDetails.payRate}\n📅 Duration: ${jobDetails.duration}\n🗓️ Start Date: ${jobDetails.startDate}\n\nWhat You'll Love About ${jobDetails.city}:\n• Vibrant local culture and dining scene\n• Excellent recreational opportunities\n• Supportive healthcare community\n• Great weather year-round\n\nWhat We Provide:\n• Competitive pay packages\n• Housing assistance and options\n• Travel and licensing reimbursement\n• 24/7 support from your dedicated recruiter\n• Comprehensive benefits package\n\nI'd love to discuss this opportunity with you in more detail. Are you available for a quick 10-minute call this week?\n\nLooking forward to hearing from you!\n\n${recruiterInfo.name}\n${recruiterInfo.email}\n${recruiterInfo.phone}\n\nExcel Medical Staffing\n"Your Partner in Healthcare Career Growth"`
                }
            ],
            strategy: "Professional, detailed email with complete job information, location benefits, and personal recruiter touch"
        },
        
        thingsToDo: {
            single: [
                "Visit Desert Botanical Garden and explore stunning desert landscapes",
                "Explore Old Town Scottsdale's art galleries and boutique shops",
                "Hike Camelback Mountain for breathtaking city views",
                "Tour the Musical Instrument Museum's world-class exhibits",
                "Visit Phoenix Art Museum's contemporary collections",
                "Explore Papago Park's unique red rock formations",
                "Discover Native American culture at the Heard Museum",
                "Take a sunrise hot air balloon ride over the Sonoran Desert",
                "Explore South Mountain Park's extensive trail system",
                "Visit Arizona Science Center's interactive exhibits"
            ],
            couple: [
                "Enjoy a romantic dinner in Old Town Scottsdale's upscale restaurants",
                "Indulge in a couples spa day at a luxury desert resort",
                "Go wine tasting in the charming town of Carefree",
                "Watch the sunset together from South Mountain's summit",
                "Attend a concert at Talking Stick Resort Arena",
                "Play golf at the famous TPC Scottsdale Stadium Course",
                "Visit Butterfly Wonderland's tropical rainforest conservatory",
                "Take a scenic drive to Sedona's red rock country",
                "Explore Roosevelt Row's vibrant arts and dining scene",
                "Enjoy a dinner cruise on Tempe Town Lake"
            ],
            family: [
                "Spend a day at Phoenix Zoo meeting animals from around the world",
                "Explore Arizona Science Center's hands-on exhibits",
                "Have fun at Castles N' Coasters amusement park",
                "Cool off at Big Surf Waterpark's wave pool and slides",
                "Go family hiking at Hole-in-the-Rock in Papago Park",
                "Visit OdySea Aquarium's underwater tunnels and exhibits",
                "Play and learn at Children's Museum of Phoenix",
                "Have a family picnic at Steele Indian School Park",
                "Visit Wildlife World Zoo and meet exotic animals",
                "Enjoy family fun and games at Topgolf"
            ]
        },
        
        placesToStay: {
            travelerHousing: [
                "Furnished Finder - Multiple Mesa and Phoenix locations with healthcare professional discounts",
                "Travel Nurse Housing - Fully furnished apartments specifically for healthcare travelers",
                "Corporate Housing by Oakwood - Extended stay suites with full kitchens",
                "BridgeStreet Worldwide - Corporate housing with flexible lease terms",
                "Blu Corporate Housing - Modern furnished apartments near major hospitals"
            ],
            hotels: [
                "Residence Inn Phoenix Mesa - Extended stay with full kitchens and free breakfast",
                "Homewood Suites by Hilton Phoenix-Mesa - Spacious suites with separate living areas",
                "Hampton Inn & Suites Phoenix-Mesa - Comfortable rooms with complimentary amenities",
                "Courtyard by Marriott Phoenix Mesa - Modern hotel with fitness center and pool",
                "Holiday Inn Express Mesa - Budget-friendly option with continental breakfast"
            ],
            rvParks: [
                "Mesa Spirit RV Resort - Luxury RV resort with resort-style amenities",
                "Countryside RV Resort - Family-friendly park with activities and pools",
                "Arizona RV Resort - Adult-oriented community with golf course access",
                "Mesa Regal RV Resort - Well-maintained park with clubhouse and fitness center",
                "Good Life RV Resort - Premium resort with spa services and organized activities"
            ]
        }
    };
    
    // Generate a simple city image placeholder (in production, this would be a real AI-generated image)
    const cityImageSvg = `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#D2691E;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Sky -->
        <rect width="100%" height="100%" fill="url(#skyGradient)"/>
        
        <!-- Mountains -->
        <polygon points="0,300 200,150 400,200 600,100 800,180 800,450 0,450" fill="url(#mountainGradient)"/>
        
        <!-- Desert floor -->
        <rect x="0" y="350" width="800" height="100" fill="#DEB887"/>
        
        <!-- Cacti -->
        <g fill="#228B22">
            <rect x="100" y="280" width="8" height="70"/>
            <rect x="95" y="300" width="18" height="8"/>
            <rect x="300" y="290" width="10" height="60"/>
            <rect x="295" y="310" width="20" height="10"/>
            <rect x="500" y="275" width="12" height="75"/>
            <rect x="494" y="295" width="24" height="12"/>
        </g>
        
        <!-- Sun -->
        <circle cx="650" cy="100" r="40" fill="#FFD700"/>
        
        <!-- City buildings silhouette -->
        <g fill="#4A4A4A" opacity="0.7">
            <rect x="200" y="250" width="30" height="100"/>
            <rect x="240" y="230" width="25" height="120"/>
            <rect x="270" y="240" width="35" height="110"/>
            <rect x="310" y="220" width="28" height="130"/>
            <rect x="350" y="235" width="32" height="115"/>
            <rect x="390" y="245" width="26" height="105"/>
        </g>
        
        <!-- Title -->
        <text x="400" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#2C3E50">
            ${jobDetails.city}, ${jobDetails.state}
        </text>
        <text x="400" y="80" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#34495E">
            ${jobDetails.jobTitle} - ${jobDetails.specialty}
        </text>
        <text x="400" y="420" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#E74C3C">
            ${jobDetails.payRate}
        </text>
    </svg>`;
    
    // Convert SVG to base64
    const cityImageBase64 = btoa(cityImageSvg);
    
    return {
        cityImage: cityImageBase64,
        socialPosts
    };
};