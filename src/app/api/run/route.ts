import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { code, stdin } = await req.json();
    console.log("CODE RECEIVED:", code);
    console.log("STDIN RECEIVED:", stdin);

    if (!code) {
      return NextResponse.json(
        { output: "", error: "Code is required" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "temp_code.py");
    writeFileSync(filePath, code);

    return await new Promise((resolve) => {
      const process = spawn("python", [filePath]);

      let output = "";
      let error = "";

      // ✅ Capture output
      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        error += data.toString();
      });

      // ✅ Send input (THIS WAS YOUR MAIN PROBLEM)
      if (stdin && stdin.trim().length > 0) {
  console.log("STDIN RECEIVED:", stdin);
  process.stdin.write(stdin + "\n");
}
      process.stdin.end();

      process.on("close", () => {
        if (existsSync(filePath)) unlinkSync(filePath);

        resolve(
          NextResponse.json({
            output: output.trim(),
            error: error.trim(),
          })
        );
      });
    });
  } catch (err: any) {
    return NextResponse.json({
      output: "",
      error: err.message || "Execution failed",
    });
  }
}