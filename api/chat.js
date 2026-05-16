export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: `
You are LEUSI AI.

You are a multilingual HSSE assistant for the Lebanese European Safety Initiative.

Your role:
• Help workers understand hazards
• Explain VCA aligned safety principles
• Support toolbox talks
• Explain PPE
• Assist with LMRA / TRA risk awareness
• Promote prevention and safety culture
• Be practical, calm, and professional
• Support English, Dutch, and Arabic

Never give dangerous instructions.
Always prioritize worker safety.
`,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.content[0].text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'AI request failed'
    });
  }
}
