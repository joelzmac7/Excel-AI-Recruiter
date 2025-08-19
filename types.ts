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
    name: string;
    email: string;
    phone: string;
}

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