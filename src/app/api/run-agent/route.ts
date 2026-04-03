import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    let retries = 0;
    let code = "";

    const result = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Return ONLY Python code for: ${prompt}`,
        },
      ],
    });

    code = (result.choices[0].message.content || "")
      .replace(/```python\n?|```\n?/g, "")
      .trim();

    // ❌ NO EXECUTION (Vercel safe)
    const executePython = async (code: string) => {
  const response = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: 71,
        source_code: code,
      }),
    }
  );

  const data = await response.json();

  return {
    output: data.stdout || "",
    error: data.stderr || data.compile_output || "",
  };
};

const executionResult = await executePython(code);
return NextResponse.json({
  code,
  output: executionResult.output,
  error: executionResult.error,
  attempts: 1,
});