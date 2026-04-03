import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { execSync, execFileSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const TEMP_FILE = join(process.cwd(), "temp.py");

function cleanup() {
  try {
    if (existsSync(TEMP_FILE)) {
      unlinkSync(TEMP_FILE);
    }
  } catch {}
}

function executeCode(code: string): { output: string; error: string | null } {
  try {
    writeFileSync(TEMP_FILE, code, "utf-8");
    const output = execFileSync("python", [TEMP_FILE], {
      encoding: "utf-8",
      timeout: 15000,
      maxBuffer: 10 * 1024 * 1024,
    });
    return { output: output.trim(), error: null };
  } catch (error: any) {
    const stderr = error.stderr || "";
    const message = error.message || "Execution failed";
    return { output: "", error: stderr || message };
  } finally {
    cleanup();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { code: "", output: "", error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { code: "", output: "", error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    let code = "";
    let output = "";
    let error: string | null = null;
    let attempts = 0;

    for (let i = 0; i < 3; i++) {
      attempts++;

      const systemPrompt = i === 0
        ? `You are a Python code generator. Output ONLY raw Python code, no explanations, no markdown, no try/except.`
        : `You are a Python code fixer. The previous code failed. Output ONLY raw fixed Python code, no explanations, no markdown. Keep the original intent.`;

      const userPrompt = i === 0
        ? `Task:\n${prompt}`
        : `Fix this code:\n${code}\n\nError:\n${error}\n\nReturn ONLY the fixed code.`;

      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      });

      const rawCode = completion.choices[0].message.content || "";
      code = rawCode.replace(/```python\n?|```\n?/g, "").trim();

      if (code.length < 5) {
        error = "Generated code too short";
        continue;
      }

      const result = executeCode(code);

      if (!result.error) {
        output = result.output;
        error = null;
        break;
      }

      error = result.error;
    }

    return NextResponse.json({ code, output, error, attempts });
  } catch (err: any) {
    cleanup();
    const message = err?.message || "Internal server error";
    return NextResponse.json(
      { code: "", output: "", error: message },
      { status: 500 }
    );
  }
}
