const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenAI, Type } = require('@google/genai');
const path = require('path');

// --- Server and Middleware Setup ---
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
// Use body-parser to handle large base64 image strings
app.use(bodyParser.json({ limit: '10mb' }));

// --- Gemini API Setup ---
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set in the server environment");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const COMPANY_NAME = 'Excel Medical Staffing';

// --- Schemas (Copied from original geminiService.ts) ---
const jobDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        jobTitle: { type: Type.STRING, description: "The primary job title, e.g., 'Travel RN'." },
        specialty: { type: Type.STRING, description: "The medical or professional specialty, e.g., 'Med Surg'." },
        city: { type: Type.STRING, description: "The city where the job is located." },
        state: { type: Type.STRING, description: "The two-letter abbreviation for the state, e.g., 'AZ'." },
        payRate: { type: Type.STRING, description: "The candidate's gross weekly pay, combining taxable and stipend, formatted as a single string, e.g., '$3,344/week'. IGNORE bill rates." },
        duration: { type: Type.STRING, description: "The duration of the assignment, e.g., '13 weeks'." },
        jobType: { type: Type.STRING, description: "The type of employment, e.g., 'Travel', 'Contract', 'Full-time'." },
        startDate: { type: Type.STRING, description: "The start date of the assignment, e.g., '07/29/2024'." },
    },
    required: ["jobTitle", "specialty", "city", "state", "payRate", "duration", "jobType", "startDate"],
};

const postContentSchema = { /* ... content as in geminiService.ts ... */ };
const emailContentSchema = { /* ... content as in geminiService.ts ... */ };
const thingsToDoSchema = { /* ... content as in geminiService.ts ... */ };
const placesToStaySchema = { /* ... content as in geminiService.ts ... */ };

const socialPostsSchema = {
    type: Type.OBJECT,
    properties: {
        linkedin: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.STRING } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for LinkedIn." },
        facebook: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.STRING } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for Facebook." },
        instagram: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.STRING } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for Instagram." },
        x: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.STRING } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for X (Twitter)." },
        sms: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.STRING } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for SMS." },
        email: { type: Type.OBJECT, properties: { variations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }, required: ["subject", "body"] } }, strategy: { type: Type.STRING } }, required: ["variations", "strategy"], description: "Content for Email." },
        thingsToDo: { type: Type.OBJECT, properties: { single: { type: Type.ARRAY, items: { type: Type.STRING } }, couple: { type: Type.ARRAY, items: { type: Type.STRING } }, family: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["single", "couple", "family"], description: "A list of top 10 local activities." },
        placesToStay: { type: Type.OBJECT, properties: { rvParks: { type: Type.ARRAY, items: { type: Type.STRING } }, hotels: { type: Type.ARRAY, items: { type: Type.STRING } }, travelerHousing: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["rvParks", "hotels", "travelerHousing"], description: "A list of lodging recommendations." },
    },
    required: ["linkedin", "facebook", "instagram", "x", "sms", "email", "thingsToDo", "placesToStay"],
};

// --- API Helper Functions (Moved from geminiService) ---

const parseJobDetailsFromImageInternal = async (imageBase64) => {
    const imagePart = { inlineData: { mimeType: 'image/png', data: imageBase64 } };
    const textPart = { text: `You are an expert AI assistant for recruiters. Analyze the provided screenshot of a job posting webpage. Your task is to extract the specific job details and format them as JSON according to the provided schema.

        **CRITICAL INSTRUCTIONS:**
        1.  **PAY RATE:** Identify the candidate's pay. If you see multiple pay figures (e.g., taxable, stipend, total), you **MUST** combine them into a single **total weekly pay rate**. The final \`payRate\` field should represent the candidate's gross weekly earnings.
        2.  **EXCLUDE BILL RATE:** You **MUST IGNORE** any mention of 'Bill Rate', 'BR', or other client-side billing information. This is confidential and should not be in the output.
        3.  **ACCURACY:** Be precise. Extract the job title, specialty, location (city and state), contract duration, and start date accurately from the text visible in the image.
        4.  **SCHEMA:** Adhere strictly to the JSON schema for the output.
        
        Analyze the image and provide the JSON data.` };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: { responseMimeType: "application/json", responseSchema: jobDetailsSchema },
    });
    return JSON.parse(response.text.trim());
};

const generateCityCollageInternal = async (details) => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `Create a vibrant, 4-panel photo collage for ${details.city}, ${details.state}, seasonally accurate for a job starting ${details.startDate}. Panels: 1) Iconic landscape/cityscape. 2) Local lifestyle activity (e.g., market, hiking). 3) Local culture/food scene. 4) Relaxing scene (e.g., park, sunset). Overlay text in lower-left: '${details.jobTitle} - ${details.specialty}' on line 1, and '${details.city}, ${details.state} | ${details.payRate}' on line 2. Text must be legible, white with a subtle black outline. Final output is one single, high-quality, photorealistic image.`,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
    });
    if (!response.generatedImages || response.generatedImages.length === 0) throw new Error("AI did not return an image collage.");
    return response.generatedImages[0].image.imageBytes;
};

const generateSocialPostsInternal = async (details, recruiterInfo, toneState) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert social media marketer and senior recruiter for "${COMPANY_NAME}". Your tone is professional and enthusiastic. Generate a complete social media campaign based on the provided schemas for the following job.
        
        **Job Details:** ${JSON.stringify(details, null, 2)}
        **Recruiter Contact Info:** ${JSON.stringify(recruiterInfo, null, 2)}

        **CRUCIAL Instructions:**
        1.  **Generate ALL Content:** You must generate content for all social platforms AND both 'thingsToDo' and 'placesToStay'.
        2.  **Call to Action:** Every single post must include a CTA with the recruiter's info: ${recruiterInfo.name}, ${recruiterInfo.email}, ${recruiterInfo.phone}.
        3.  **Localized Tone (SMS/Email):** For 'sms' and 'email', adopt a communication style that reflects the local culture of **${toneState}**. If 'Default', use a general friendly American tone.
        4.  **Things to Do (Seasonal & Local):** The 'thingsToDo' object activities must be specific to ${details.city}, ${details.state} and relevant for the season based on the start date (${details.startDate}). Provide 10 unique items for each category.
        5.  **Places to Stay (Crucial & Local):** The 'placesToStay' object must list 5-10 specific, named recommendations for each category in or very near ${details.city}, ${details.state}.
        6.  **Email Content:** For emails, provide a compelling 'subject' and a detailed 'body'. The body MUST integrate a summary of local attractions and housing info.`,
        config: { responseMimeType: "application/json", responseSchema: socialPostsSchema },
    });
    return JSON.parse(response.text.trim());
};


// --- API Endpoints ---

app.post('/api/parse-job-details', async (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Missing imageBase64 payload' });
    try {
        const details = await parseJobDetailsFromImageInternal(imageBase64);
        res.json(details);
    } catch (error) {
        console.error("Error in /api/parse-job-details:", error);
        res.status(500).json({ error: error.message || 'Failed to analyze screenshot with AI.' });
    }
});

app.post('/api/generate-campaign', async (req, res) => {
    const { jobDetails, recruiterInfo, toneState } = req.body;
    if (!jobDetails || !recruiterInfo || !toneState) return res.status(400).json({ error: 'Missing required payload' });

    try {
        const imagePromise = generateCityCollageInternal(jobDetails);
        const postsPromise = generateSocialPostsInternal(jobDetails, recruiterInfo, toneState);
        const [cityImage, socialPosts] = await Promise.all([imagePromise, postsPromise]);
        res.json({ cityImage, socialPosts });
    } catch (error) {
        console.error("Error in /api/generate-campaign:", error);
        res.status(500).json({ error: error.message || 'Failed to generate campaign.' });
    }
});

// --- Static File Serving ---
app.use(express.static(path.resolve(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
