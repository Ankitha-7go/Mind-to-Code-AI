import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function runPython(filePath: string): Promise<{ output: string; error: string }> {
  return new Promise((resolve) => {
    const cmd = process.platform === "win32" ? `python "${filePath}"` : `python3 "${filePath}"`;
    exec(cmd, { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ output: "", error: stderr || error.message });
      } else {
        resolve({ output: stdout, error: "" });
      }
    });
  });
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    let code = "";
    let result = { output: "", error: "" };

    const gen = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a professional Python code generator.

STRICT RULES:
- Return ONLY valid Python code
- NO explanations
- NO markdown
- NO backticks
- NO comments unless inside Python code

Task:
${prompt}`,
        },
      ],
    });

    code = (gen.choices[0].message.content || "").replace(/```python\n?|```\n?/g, "").trim();

    const execute = async (codeToRun: string) => {
      const filePath = path.join(process.cwd(), "temp.py");
      fs.writeFileSync(filePath, codeToRun, "utf-8");
      return await runPython(filePath);
    };

    result = await execute(code);

    let retries = 0;

    while (result.error && retries < 2) {
      const fix = await client.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a debugging Python expert.

Fix the code so it runs without errors.

Rules:
- Return ONLY corrected Python code
- No explanation

Error:
${result.error}

Code:
${code}`,
          },
        ],
      });

      code = (fix.choices[0].message.content || "").replace(/```python\n?|```\n?/g, "").trim();
      result = await execute(code);
      retries++;
    }

    return NextResponse.json({
      code,
      output: result.output,
      error: result.error,
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
