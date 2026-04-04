import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, stdin } = await req.json();

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: 71, // Python
          source_code: code,
          stdin: stdin || "",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      output: data.stdout || data.compile_output || "",
      error: data.stderr || "",
    });
  } catch (err: any) {
    return NextResponse.json({
      output: "",
      error: err.message || "Execution failed",
    });
  }
}