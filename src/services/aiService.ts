export interface LoveAnalysis {
  score: number;
  summary: string;
  analysis: string;
  advice: string;
  action_tip: string;
}

export const analyzeRelationship = async (score: number, answers: any): Promise<LoveAnalysis | null> => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/analyze-love`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        answers,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.analysis;

  } catch (error) {
    console.error("AI Love Analysis Failed:", error);
    return null;
  }
};
