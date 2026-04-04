import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

if (!process.env.OPENROUTER_API_KEY) {
  console.error("ERROR: OPENROUTER_API_KEY environment variable is not set");
}

const openaiClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});

const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

async function generateCode(prompt: string): Promise<string> {
  console.log("generateCode called with prompt:", prompt);

  // Try OpenRouter first
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log("Trying OpenRouter...");
      const response = await openaiClient.chat.completions.create({
        model: "openai/gpt-4o-mini",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: "You are a Python code generator. Generate clean, correct, and efficient Python code based on the user's request. Only return the code, no explanations or markdown formatting. Make sure the code is runnable and includes comments if helpful. Do not generate 'Hello World' unless specifically requested."
          },
          {
            role: "user",
            content: `Generate Python code for: ${prompt}`
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        console.log("OpenRouter succeeded");
        return content.trim();
      }
    } catch (error: any) {
      console.error("OpenRouter failed:", error.message);
    }
  }

  // Try Anthropic as fallback
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log("Trying Anthropic...");
      const response = await anthropicClient.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        system: "You are a Python code generator. Generate clean, correct, and efficient Python code based on the user's request. Only return the code, no explanations or markdown formatting. Make sure the code is runnable and includes comments if helpful.",
        messages: [
          {
            role: "user",
            content: `Generate Python code for: ${prompt}`
          }
        ],
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      if (content) {
        console.log("Anthropic succeeded");
        return content.trim();
      }
    } catch (error: any) {
      console.error("Anthropic failed:", error.message);
    }
  }

  console.log("All AI services failed, using fallback");
  // Fallback to mock responses if all APIs fail

    // Fallback to mock responses if API fails
    const promptLower = prompt.toLowerCase();
    console.log("Prompt lower:", promptLower);

    // Avoid the generic Hello World for algorithm requests
    if (promptLower.includes("merge sort")) {
      console.log("Returning merge sort code");
      return `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = merge_sort(arr)
print("Original array:", arr)
print("Sorted array:", sorted_arr)`;
    } else if (promptLower.includes("quick sort")) {
      console.log("Returning quick sort code");
      return `def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = quick_sort(arr)
print("Original array:", arr)
print("Sorted array:", sorted_arr)`;
    } else if (promptLower.includes("bubble sort")) {
      console.log("Returning bubble sort code");
      return `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", arr)
print("Sorted array:", bubble_sort(arr))`;
    } else if (promptLower.includes("fibonacci")) {
      return `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`;
    } else if (promptLower.includes("merge sort")) {
      console.log("Returning merge sort code");
      return `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = merge_sort(arr)
print("Original array:", arr)
print("Sorted array:", sorted_arr)`;
    } else if (promptLower.includes("bubble sort")) {
      return `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", arr)
bubble_sort(arr)
print("Sorted array:", arr)`;
    } else if (promptLower.includes("quick sort")) {
      return `def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = quick_sort(arr)
print("Original array:", arr)
print("Sorted array:", sorted_arr)`;
    } else if (promptLower.includes("binary search")) {
      return `def binary_search(arr, target):
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

# Example usage
arr = [2, 3, 4, 10, 40]
target = 10
result = binary_search(arr, target)
print(f"Element {target} is at index {result}" if result != -1 else f"Element {target} not found")`;
    } else if (promptLower.includes("linear search")) {
      return `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example usage
arr = [2, 3, 4, 10, 40]
target = 10
result = linear_search(arr, target)
print(f"Element {target} is at index {result}" if result != -1 else f"Element {target} not found")`;
    } else if (promptLower.includes("factorial")) {
      return `def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Example usage
num = 5
print(f"Factorial of {num} is {factorial(num)}")`;
    } else if (promptLower.includes("prime")) {
      return `def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

# Example usage
num = 17
print(f"{num} is prime: {is_prime(num)}")`;
    } else {
      // Fallback: Generate basic code based on common patterns
      const promptLower = prompt.toLowerCase();
      
      if (promptLower.includes("function") || promptLower.includes("def ")) {
        return `# ${prompt}
def ${promptLower.includes("function") ? "my_function" : "example_function"}():
    # TODO: Implement the function logic
    pass

# Example usage
result = ${promptLower.includes("function") ? "my_function" : "example_function"}()
print(result)`;
      } else if (promptLower.includes("class")) {
        return `# ${prompt}
class ${promptLower.split("class")[1]?.trim().split(" ")[0] || "MyClass"}:
    def __init__(self):
        # TODO: Initialize class attributes
        pass
    
    def method(self):
        # TODO: Implement method logic
        return "Hello from method"

# Example usage
obj = ${promptLower.split("class")[1]?.trim().split(" ")[0] || "MyClass"}()
print(obj.method())`;
      } else if (promptLower.includes("loop") || promptLower.includes("for") || promptLower.includes("while")) {
        return `# ${prompt}
# Example loop
for i in range(5):
    print(f"Iteration {i + 1}")

# Or while loop
counter = 0
while counter < 3:
    print(f"Counter: {counter}")
    counter += 1`;
      } else if (promptLower.includes("if") || promptLower.includes("condition")) {
        return `# ${prompt}
# Example conditional
x = 10
if x > 5:
    print("x is greater than 5")
elif x == 5:
    print("x is equal to 5")
else:
    print("x is less than 5")`;
      } else if (promptLower.includes("list") || promptLower.includes("array")) {
        return `# ${prompt}
# Example list operations
my_list = [1, 2, 3, 4, 5]

# Add elements
my_list.append(6)

# Access elements
print(f"First element: {my_list[0]}")
print(f"List length: {len(my_list)}")

# Iterate through list
for item in my_list:
    print(item)`;
      } else if (promptLower.includes("dictionary") || promptLower.includes("dict")) {
        return `# ${prompt}
# Example dictionary operations
my_dict = {"name": "Alice", "age": 30, "city": "New York"}

# Add key-value pair
my_dict["job"] = "Developer"

# Access values
print(f"Name: {my_dict['name']}")
print(f"Age: {my_dict.get('age', 'Not found')}")

# Iterate through dictionary
for key, value in my_dict.items():
    print(f"{key}: {value}")`;
      } else {
        console.log("Returning default code");
        return `# ${prompt}
# Basic Python program
print("Hello, World!")
print("This is a basic Python program.")
print(f"You asked for: {prompt}")

# TODO: Implement the specific functionality you requested`;
      }
    }
  }


export async function POST(req: Request) {
  try {
    console.log("POST /api/generate received");

    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Processing prompt:", prompt);

    // Generate code using AI
    const generatedCode = await generateCode(prompt);

    return NextResponse.json({
      code: generatedCode,
      error: "",
      output: "",
    });

  } catch (err: any) {
    console.error("Generate API error:", err);

    return NextResponse.json(
      {
        error: err.message || "Failed to generate code",
        code: "",
        output: "",
      },
      { status: 500 }
    );
  }
}