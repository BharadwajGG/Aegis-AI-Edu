export async function fetchConceptCoach(prompt, apiKey, systemPrompt) {
  if (!apiKey) {
    // Mock response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("This is a simulated response in Mock Mode. Please add your Anthropic API Key in the OS configuration to enable live AI responses.");
      }, 1500);
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true", // Only for testing!
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Error fetching AI");
    }

    const data = await res.json();
    return data.content[0].text;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
