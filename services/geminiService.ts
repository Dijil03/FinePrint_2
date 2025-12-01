import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskSeverity, AnalysisVerdict } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A safety score from 0 to 100. 100 is extremely safe/user-friendly, 0 is predatory.",
    },
    verdict: {
      type: Type.STRING,
      enum: ["RECOMMENDED", "ACCEPTABLE", "CAUTION", "AVOID"],
      description: "Final verdict on whether the user should accept these terms.",
    },
    recommendation: {
      type: Type.STRING,
      description: "A definitive 'Yes' or 'No' style advice. E.g., 'Safe to use', 'Use with extreme caution', or 'Do not agree'.",
    },
    summary: {
      type: Type.STRING,
      description: "A short, punchy summary of the Terms of Service. Mention the biggest red flag or green flag.",
    },
    companyName: {
      type: Type.STRING,
      description: "The name of the company or service inferred from the text.",
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: {
            type: Type.STRING,
            description: "The exact short excerpt from the text that contains the issue.",
          },
          simplifiedTranslation: {
            type: Type.STRING,
            description: "A plain English translation of what this actually means for the user.",
          },
          severity: {
            type: Type.STRING,
            enum: ["HIGH", "MEDIUM", "LOW", "SAFE"],
            description: "The risk level of this clause.",
          },
          category: {
            type: Type.STRING,
            description: "Category of the issue, e.g., 'Privacy', 'Billing', 'Liability', 'Content Ownership'.",
          },
          explanation: {
            type: Type.STRING,
            description: "Why this is good or bad.",
          },
        },
        required: ["originalText", "simplifiedTranslation", "severity", "category", "explanation"],
      },
    },
  },
  required: ["score", "verdict", "recommendation", "summary", "items"],
};

export const analyzeTosText = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following Terms of Service / Privacy Policy text. 
      Identify "Red Flags" (scary clauses like selling data, waiving rights, hard cancellation) and "Green Flags" (user-friendly terms).
      
      Determine a final verdict (RECOMMENDED, ACCEPTABLE, CAUTION, AVOID) based on how predatory the terms are.
      
      Text to analyze:
      "${text.substring(0, 100000)}" 
      
      (Truncated if over 100k characters, focus on the available text).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert consumer rights lawyer and privacy advocate. Your goal is to protect users from predatory legal terms. Be cynical but fair. Translate legalese into blunt, simple English. Your 'recommendation' must be a clear directive on whether it is okay to use the service.",
      },
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("No response from Gemini");
    }
    
    // Sanitize the output to ensure no markdown fences interfere with JSON parsing
    const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanedText) as AnalysisResult;
    
    // Add IDs to items for React keys
    parsed.items = parsed.items.map((item, index) => ({
        ...item,
        id: `risk-${index}-${Date.now()}`
    }));

    return parsed;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};