import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { code, stdin } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ output: "", error: "Code is required" }, { status: 400 });
    }

    const codeFile = path.join(process.cwd(), "temp_code.py");
    writeFileSync(codeFile, code, "utf-8");

    let output = "";
    let error = "";

    try {
      const options: any = {
        encoding: "utf-8",
        timeout: 15000,
        maxBuffer: 10 * 1024 * 1024,
      };

      if (stdin && typeof stdin === "string" && stdin.trim()) {
        const lines = stdin.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          options.input = lines.join('\n') + '\n';
        }
      }

      const result = execSync("python " + JSON.stringify(codeFile), options);
      output = result.toString().trim();
    } catch (err: any) {
      if (err.status === 1 && err.stdout) {
        output = err.stdout.toString().trim();
      } else if (err.stderr) {
        error = err.stderr.toString().trim();
      } else if (err.stdout) {
        output = err.stdout.toString().trim();
      }
      
      if (!output && !error) {
        error = err.message || "Execution failed";
      }
    } finally {
      try {
        if (existsSync(codeFile)) {
          unlinkSync(codeFile);
        }
      } catch {}
    }

    return NextResponse.json({ output, error });
  } catch (err: any) {
    return NextResponse.json({ output: "", error: err.message || "Execution failed" });
  }
}
