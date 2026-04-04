import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { code: "", output: "", error: "Prompt is required", attempts: 0 },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { code: "", output: "", error: "API key not configured", attempts: 0 },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: `You are a Python code generator.

IMPORTANT RULES:
1. Output ONLY raw Python code - NO markdown, NO backticks, NO explanations
2. Code must be COMPLETE and FULLY EXECUTABLE
3. Use HARDCODED sample values (no input())
4. Add a comment before EVERY important line explaining what it does
5. Print the result clearly

EXAMPLE FOR FACTORIAL:
# Take a number as input (hardcoded sample value)
num = 5
# Calculate factorial using a loop
factorial = 1
for i in range(1, num + 1):
    factorial *= i
# Print the final result
print(f"Factorial of {num} is: {factorial}")

EXAMPLE FOR BINARY SEARCH:
# Define a sorted array of numbers
arr = [2, 3, 4, 10, 40]
# Define the target value to search
target = 10
# Binary search algorithm
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
# Call the function and store result
result = binary_search(arr, target)
# Print the result
print(f"Element {target} is at index: {result}")

Every line should have a comment explaining it. Use clear, descriptive comments.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { code: "", output: "", error: "API request failed", attempts: 1 },
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawCode = data?.choices?.[0]?.message?.content || "";
    
    let code = rawCode
      .replace(/```python\n?/g, "")
      .replace(/```\n?$/g, "")
      .trim();

    if (!code) {
      return NextResponse.json(
        { code: rawCode, output: "", error: "", attempts: 1 }
      );
    }

    return NextResponse.json({ 
      code, 
      output: "", 
      error: "", 
      attempts: 1 
    });
  } catch (err: any) {
    return NextResponse.json(
      { code: "", output: "", error: err?.message || "Failed to generate code", attempts: 1 },
      { status: 500 }
    );
  }
}
