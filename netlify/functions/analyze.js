export default async (req) => {
  try {
    const body = await req.json()
    const text = body.text || ""

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: 'Analyze AI governance risks and return ONLY valid JSON with this exact structure: {"risk_level":"high|medium|low","issues":["issue 1","issue 2"],"recommendations":["recommendation 1","recommendation 2"]}'
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2
      })
    })

    const data = await response.json()

    let result = data?.choices?.[0]?.message?.content || ""

    result = result.replace(/```json/g, "").replace(/```/g, "").trim()

    let parsed
    try {
      parsed = JSON.parse(result)
    } catch (e) {
      return new Response(
        JSON.stringify({
          risk_level: "unknown",
          issues: ["Model did not return valid JSON"],
          recommendations: ["Check prompt or inspect raw response"],
          raw: result
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200
        }
      )
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        risk_level: "unknown",
        issues: ["Server error"],
        recommendations: ["Check Netlify function logs"],
        error: String(err)
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    )
  }
}
