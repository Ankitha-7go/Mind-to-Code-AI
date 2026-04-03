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
    let executionResult = {
      output: "Execution disabled on Vercel",
      error: "",
    };

    while (executionResult.error && retries < 2) {
      const fix = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Fix this Python code:

Return ONLY corrected Python code.

Error:
${executionResult.error}

Code:
${code}`,
          },
        ],
      });

      code = (fix.choices[0].message.content || "")
        .replace(/```python\n?|```\n?/g, "")
        .trim();

      executionResult = {
        output: "Execution disabled on Vercel",
        error: "",
      };

      retries++;
    }

    return NextResponse.json({
      code,
      output: executionResult.output,
      error: executionResult.error,
      attempts: retries + 1,
    });

  } catch (err: any) {
    return NextResponse.json({
      code: "",
      output: "",
      error: err.message || "Internal error",
      attempts: 0,
    });
  }
}