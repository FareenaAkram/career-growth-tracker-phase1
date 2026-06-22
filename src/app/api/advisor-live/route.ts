import { NextResponse } from "next/server";

type RequestBody = {
  interests?: string[];
  skills?: string[];
  education?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const system = `You are an assistant that suggests relevant careers based on user interests, skills and education. Return a JSON object with a top-level field named \"suggestions\" which is an array of objects with the fields: id, title, reason, roadmapSummary (array of strings). Do not return any additional text.`;

    const userPrompt = `User interests: ${JSON.stringify(body.interests || [])}\nUser skills: ${JSON.stringify(body.skills || [])}\nEducation: ${body.education || ""}\nRespond with JSON only.`;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.8,
    } as any;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: "OpenAI error", detail: t }, { status: 502 });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    // Try to parse JSON from the assistant
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (e) {
      // If parsing fails, return raw text
      return NextResponse.json({ error: "Invalid JSON from AI", raw: text }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
