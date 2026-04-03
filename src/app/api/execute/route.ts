import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ output: "", error: "Code is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "temp.py");
    fs.writeFileSync(filePath, code, "utf-8");

    const result = await new Promise<{ output: string; error: string }>((resolve) => {
      const cmd = process.platform === "win32" ? `python "${filePath}"` : `python3 "${filePath}"`;
      exec(cmd, { timeout: 15000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ output: "", error: stderr || error.message });
        } else {
          resolve({ output: stdout, error: "" });
        }
      });
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ output: "", error: err.message || "Execution failed" });
  }
}
