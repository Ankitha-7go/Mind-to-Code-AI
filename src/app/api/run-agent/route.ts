import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

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

    const code = (result.choices[0].message.content || "")
      .replace(/```python\n?|```\n?/g, "")
      .trim();

    // ✅ REAL EXECUTION (Judge0 free endpoint)
    const executePython = async (code: string) => {
  const submit = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=false",
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

  const submitData = await submit.json();
  const token = submitData.token;

  // wait for result
  await new Promise((r) => setTimeout(r, 2000));

  const result = await fetch(
    `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
  );

  const data = await result.json();

  return {
    output: data.stdout || data.compile_output || "",
    error: data.stderr || "",
  };
};