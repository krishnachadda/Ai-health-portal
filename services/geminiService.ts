import { GoogleGenAI, Type } from "@google/genai";
import type { SymptomData, AnalysisResult } from '../types';

const GEMINI_API_KEY = process.env.API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("API_KEY environment variable is not set for Gemini.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    ai_confidence: { type: Type.NUMBER, description: "AI's confidence in the analysis from 0 to 100." },
    conditions_analyzed: { type: Type.INTEGER, description: "Total number of potential conditions analyzed." },
    urgency_level: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'], description: "Urgency level for seeking medical attention." },
    recommendations: { type: Type.INTEGER, description: "Number of recommendations in the care plan." },
    conditions: {
      type: Type.ARRAY,
      description: "A list of potential medical conditions, sorted by probability.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the condition." },
          probability: { type: Type.NUMBER, description: "Probability of the condition from 0 to 100." },
          description: { type: Type.STRING, description: "A brief description of the condition." },
        },
        required: ['name', 'probability', 'description'],
      },
    },
    risk_assessment: {
      type: Type.ARRAY,
      description: "Assessment of risk factors based on user input.",
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The risk factor (e.g., Age Factor, Symptom Severity)." },
          value: { type: Type.NUMBER, description: "A numerical score from 0-100 for the risk factor." },
        },
        required: ['factor', 'value'],
      },
    },
    symptom_analysis: {
      type: Type.OBJECT,
      properties: {
        severity: { type: Type.STRING, description: "Categorized severity (e.g., Moderate)." },
        duration_pattern: { type: Type.STRING, description: "Pattern of symptom duration (e.g., Acute)." },
        progression: { type: Type.STRING, description: "Symptom progression (e.g., Stable)." },
      },
      required: ['severity', 'duration_pattern', 'progression'],
    },
    care_plan: {
      type: Type.ARRAY,
      description: "A personalized care plan with actionable steps.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the care plan item." },
          description: { type: Type.STRING, description: "Detailed description of the recommendation." },
          type: { type: Type.STRING, enum: ['recommendation', 'caution'], description: "Type of care plan item." },
        },
        required: ['title', 'description', 'type'],
      },
    },
    timeline: {
      type: Type.ARRAY,
      description: "A suggested follow-up timeline.",
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Timeframe for the timeline event (e.g., 24-48 Hours)." },
          title: { type: Type.STRING, description: "Title of the timeline event." },
          description: { type: Type.STRING, description: "Description of what to do in this timeframe." },
        },
        required: ['time', 'title', 'description'],
      },
    },
  },
  required: ['ai_confidence', 'conditions_analyzed', 'urgency_level', 'recommendations', 'conditions', 'risk_assessment', 'symptom_analysis', 'care_plan', 'timeline'],
};

export const analyzeSymptoms = async (data: SymptomData): Promise<AnalysisResult> => {
  try {
    const prompt = `You are an advanced medical AI assistant. Analyze the following patient symptoms and provide a professional-grade analysis. Your response must be in JSON format and conform to the provided schema. Patient Information: - Age: ${data.age} - Gender: ${data.gender} - Symptom Severity: ${data.severity} - Symptom Duration: ${data.duration} - Symptoms Description: ${data.description} - Relevant Medical History: ${data.history || 'None provided'}. Analysis tasks: 1. Provide a list of 3-4 possible conditions with their probability. The sum of probabilities should be close to 100. 2. Assess the urgency level for seeking medical care. 3. Generate a risk assessment based on the provided factors. 4. Create a personalized care plan with clear, actionable recommendations. 5. Suggest a follow-up timeline. 6. The overall AI confidence should reflect the quality and specificity of the input data. IMPORTANT: Provide only the JSON object in your response. Do not include any explanatory text before or after the JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    
    // Common post-processing
    if (result.conditions) {
        result.conditions.sort((a, b) => b.probability - a.probability);
    }

    return result;

  } catch (error) {
    console.error(`Error calling Gemini API:`, error);
    throw new Error(`Failed to get analysis from the AI provider.`);
  }
};