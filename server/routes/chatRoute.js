import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with safety settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Context for the AI to understand its role
const SYSTEM_CONTEXT = `You are a friendly Blood Donation Assistant chatbot. Your role is to provide concise, helpful information about blood donation.

Guidelines for responses:
1. Keep responses short and focused (max 2-3 paragraphs)
2. Be conversational and friendly
3. Use simple language
4. Only use bullet points when listing items
5. Only bold the most important 2-3 points
6. For greetings or simple questions, keep responses to 1-2 sentences

Topics you can help with:
• Blood types and compatibility
• Donation eligibility
• Health benefits
• Common myths
• Preparation tips
• Emergency guidelines

Remember to:
- Be concise and direct
- Stay friendly but professional
- Use formatting sparingly
- Keep medical terms simple`;

// GET route for testing
router.get('/', (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
            error: 'Server configuration error',
            details: 'Gemini API key is not configured'
        });
    }
    res.json({ message: "Chatbot API is working" });
});

// POST route for chat messages
router.post('/', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
            error: 'Server configuration error',
            details: 'Gemini API key is not configured'
        });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get the model with specific configuration
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 0.8,
                maxOutputTokens: 2048,
            }
        });

        try {
            // Construct the prompt with clear formatting
            const prompt = `${SYSTEM_CONTEXT}

User Message: ${message}

Please provide a friendly, concise response that:
1. Directly addresses the user's question
2. Uses simple language
3. Keeps formatting minimal
4. Stays brief and focused

Response:`;

            // Generate response
            const result = await model.generateContent(prompt);
            const response = await result.response;
            
            if (!response || !response.text()) {
                throw new Error('Empty response from AI service');
            }
            
            // Format the response text with markdown
            let formattedResponse = response.text()
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
                .replace(/\n/g, '<br>')  // Line breaks
                .replace(/•/g, '•')  // Preserve bullet points
                .trim();
            
            // If it's a greeting or simple message, keep it very concise
            if (message.toLowerCase().match(/^(hi|hello|hey|hii|hiii|hiiii)/)) {
                formattedResponse = "Hi! 👋 I'm here to help you learn about blood donation. What would you like to know?";
            }
            
            // Send the response
            res.json({ response: formattedResponse });
        } catch (genAIError) {
            console.error('Gemini AI Error:', genAIError);
            
            // Handle specific Gemini API errors
            if (genAIError.message.includes('API key')) {
                res.status(500).json({ 
                    error: 'Authentication error with AI service',
                    details: 'Please check your API key configuration'
                });
            } else if (genAIError.message.includes('SAFETY')) {
                res.status(400).json({ 
                    error: 'Content safety error',
                    details: 'The request was blocked due to safety concerns'
                });
            } else {
                res.status(500).json({ 
                    error: 'AI service error',
                    details: genAIError.message
                });
            }
        }
    } catch (error) {
        console.error('General Error:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
});

export default router; 