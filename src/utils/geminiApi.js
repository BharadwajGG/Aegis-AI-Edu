export async function fetchConceptCoach(prompt, apiKey, systemPrompt) {
  if (!apiKey) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Mock Mode Active: Please configure your Gemini API Key in the OS settings to start receiving intelligent, hint-based coaching!");
      }, 1500);
    });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7, // A good balance for educational hints and quizzes
        }
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Error communicating with AI");
    }

    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
