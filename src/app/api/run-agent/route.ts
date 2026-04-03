import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await client.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Return ONLY Python code for: ${prompt}`,
      },
    ],
  });

  const code = result.choices[0].message.content || "";

  return NextResponse.json({
    code,
    output: "Execution disabled on Vercel",
    error: "",
  });
}

code = (gen.choices[0].message.content || "")
  .replace(/```python\n?|```\n?/g, "")
  .trim();

// ❌ VERCEL SAFE EXECUTION (NO FILE SYSTEM)
const execute = async (codeToRun: string) => {
  return {
    output: "Python execution disabled on Vercel. Use backend server.",
    error: "",
  };
};

result = await execute(code);

let retries = 0;

while (result.error && retries < 2) {
  const fix = await client.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Fix this Python code:

Return ONLY corrected Python code.

Error:
${result.error}

Code:
${code}`,
      },
    ],
  });

  code = (fix.choices[0].message.content || "")
    .replace(/```python\n?|```\n?/g, "")
    .trim();

  result = await execute(code);
  retries++;
};

return NextResponse.json({
  code,
  output: result.output,
  error: result.error,
  attempts: retries + 1,
});