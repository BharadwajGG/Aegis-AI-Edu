export async function fetchConceptCoach(prompt, apiKey, systemPrompt) {
  // Mock mode override if running without API keys AND no backend is available locally
  if (apiKey === "MOCK") {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Mock Mode Active: Please configure your Gemini API Key in the OS settings to start receiving intelligent coaching!");
      }, 1500);
    });
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    
    const res = await fetch(`${API_URL}/api/coach/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        system_prompt: systemPrompt,
        api_key: apiKey || null
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || err.error?.message || "Error communicating with AI Backend");
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    console.error("Coach API Error:", err);
    throw err;
  }
}
