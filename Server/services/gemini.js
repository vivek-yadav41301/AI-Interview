import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// console.log("AQ.Ab8RN6IzdSHkehXukvaXisIH5e-osUjpECITq92qcUKM2PfjXg")
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error; // Error ko controller tak bhej do
  }
}
