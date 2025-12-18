import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { ComplaintFormData } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateComplaintLetter = async (formData: ComplaintFormData): Promise<string> => {
  const ai = getClient();
  
  let promptText = `
    Generate a formal civic complaint letter based on the following details:
    
    Category: ${formData.category}
    User Name: ${formData.userName}
    Location: ${formData.location}
    Issue Details: ${formData.description}
    Urgency Level: ${formData.urgency}
    
    Ensure the letter is formatted correctly with a subject line, proper salutation, body paragraphs, and closing.
  `;

  if (formData.image) {
    promptText += "\n\nAn image of the issue is provided. Please analyze the image to identify specific visual details (e.g., size of potholes, amount of garbage, condition of animals) and incorporate these details into the 'Issue Details' section of the letter to make it more evidence-based and compelling.";
  }

  const parts: any[] = [{ text: promptText }];

  if (formData.image) {
    // Extract base64 data from data URL (e.g., "data:image/jpeg;base64,...")
    const base64Data = formData.image.split(',')[1];
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and formality
      },
    });

    if (response.text) {
        return response.text;
    }
    
    throw new Error("No text generated from the model.");

  } catch (error) {
    console.error("Error generating complaint letter:", error);
    throw error;
  }
};