"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="text-gray-400 text-lg md:text-xl">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function FloatingOrb({ className, duration = 20 }: { className: string; duration?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{ 
        y: [0, -60, 0], 
        x: [0, 30, 0], 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 1000 }}
    />
  );
}

function Animated3DCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateXValue = ((y - centerY) / centerY) * -15;
      const rotateYValue = ((x - centerX) / centerX) * 15;
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

function StepCard({ number, title, description, icon }: { number: number; title: string; description: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: -45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: number * 0.15, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(34, 211, 238, 0.4)",
        rotateY: 5,
        rotateX: -5
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
        style={{ transform: "translateZ(-20px)" }}
      />
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <motion.div 
          className="text-5xl mb-4"
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <div className="text-cyan-400 font-bold text-sm mb-2">STEP {number}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Animated3DCard>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: "spring" }}
        whileHover={{ 
          y: -15, 
          boxShadow: "0 30px 60px -15px rgba(168, 85, 247, 0.5)",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 hover:border-purple-500/50"
      >
        <motion.div 
          className="text-4xl mb-4"
          whileHover={{ scale: 1.2, rotate: [0, -15, 15, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </motion.div>
    </Animated3DCard>
  );
}

function TerminalDemo() {
  const [phase, setPhase] = useState(0);
  const lines = [
    { text: "$ python generate.py", color: "text-gray-400", delay: 0 },
    { text: "> Analyzing request...", color: "text-purple-400", delay: 500 },
    { text: "> Generating code...", color: "text-cyan-400", delay: 1200 },
    { text: "> Executing in sandbox...", color: "text-yellow-400", delay: 2000 },
    { text: "! Error: NameError: x is not defined", color: "text-red-400", delay: 3000 },
    { text: "> Self-healing: fixing code...", color: "text-pink-400", delay: 4200 },
    { text: "> Re-executing...", color: "text-cyan-400", delay: 5600 },
    { text: "✓ Success! Output: 42", color: "text-green-400", delay: 6800 },
  ];

  useEffect(() => {
    if (phase < lines.length - 1) {
      const timer = setTimeout(() => setPhase(phase + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-gray-500 text-sm">sandbox — bash — 80x24</span>
        </div>
        <div className="p-6 font-mono text-sm h-64 overflow-y-auto">
          {lines.slice(0, phase + 1).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${line.color} mb-1`}
            >
              {line.text}
            </motion.div>
          ))}
          {phase < lines.length - 1 && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-cyan-400"
            >
              ▋
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ResponseData {
  code: string;
  output: string;
  error: string;
  attempts?: number;
}

function CodeEditor() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState<string>("idle");
  const [stdin, setStdin] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse(null);
    setStep("generating");
    setStdin("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      const newResponse = {
        code: data.code || "",
        output: data.output || "",
        error: data.error || "",
        attempts: data.attempts || 1,
      };

      setResponse(newResponse);
      setStep("done");
      setStdin("");

      const hasInput = /\binput\s*\(/.test(newResponse.code);

      if (newResponse.code && !hasInput) {
        setRunning(true);
        setStep("running");
        
        const runRes = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: newResponse.code, stdin: "" }),
        });
        const runData = await runRes.json();
        
        setResponse(prev => prev ? {
          ...prev,
          output: runData.output || "",
          error: runData.error || "",
        } : null);
      }
    } catch (err) {
      setResponse({
        code: "",
        output: "",
        error: "Failed to generate code. Please try again.",
      });
      setStep("done");
    } finally {
      setLoading(false);
      setRunning(false);
    }
  };

  const handleRun = async () => {
  if (!response?.code) return;

  setStep("executing");

  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: response.code,
        stdin: stdin || "",
      }),
    });

    const data = await res.json();

    setResponse((prev: any) => ({
      ...prev,
      output: data.output,
      error: data.error,
    }));
  } catch {
    setResponse((prev: any) => ({
      ...prev,
      error: "Execution failed",
    }));
  }

  setStep("done");
};

  const hasCode = response?.code && response.code.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-gray-500 text-sm">prompt — input</span>
        </div>
        <div className="p-6">
          <textarea
            className="w-full h-32 p-4 rounded-lg bg-[#111] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 transition-colors resize-none font-mono text-sm"
            placeholder="e.g. Write a program to find factorial of a number using input()"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !loading && prompt.trim()) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            disabled={loading}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {loading && (
                <span className="text-cyan-400 text-sm animate-pulse">
                  Generating...
                </span>
              )}
              {running && (
                <span className="text-yellow-400 text-sm animate-pulse">
                  Running...
                </span>
              )}
              {!loading && !running && prompt.trim() && (
                <span className="text-gray-500 text-xs">
                  Press Ctrl+Enter to generate
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-full shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Code"}
            </motion.button>
          </div>
        </div>
      </div>

      {response && hasCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl"
        >
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <span className="text-green-400 font-medium">Code</span>
            <span className="text-gray-500 text-sm">Attempts: {response.attempts || 1}</span>
          </div>
          <div className="rounded-lg bg-[#0d1117] p-4 m-4 border border-green-500/20 overflow-x-auto max-h-64">
            <pre className="text-sm text-green-300 font-mono">
              {(() => {
                const lines = response.code.split('\n');
                let lineNum = 0;
                return lines.map((line: string) => {
                  if (line.trim() === '' || line.trim().startsWith('#')) {
                    return '';
                  }
                  lineNum++;
                  return `${lineNum}. ${line}`;
                }).filter(Boolean).join('\n');
              })()}
            </pre>
          </div>

          <div className="px-4 pb-2">
            <span className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-400">Comments</span>
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-lg bg-[#1a1b26] p-4 mx-4 border border-yellow-500/20 overflow-x-auto max-h-64">
              <pre className="text-sm text-yellow-400 font-mono">
                {(() => {
                  const codeLines = response.code.split('\n').filter((line: string) => line.trim() !== '' && !line.trim().startsWith('#'));
                  return codeLines.map((line: string, idx: number) => {
                    const lineNum = idx + 1;
                    let comment = '';
                    const trimmed = line.trim();
                    
                    if (trimmed.startsWith('def ')) {
                      const match = trimmed.match(/def\s+(\w+)\s*\((.*)\)/);
                      if (match) {
                        comment = `Define function "${match[1]}" with parameters: ${match[2] || 'none'}`;
                      }
                    } else if (trimmed.startsWith('for ')) {
                      comment = 'Loop through elements';
                    } else if (trimmed.startsWith('if ')) {
                      comment = 'Check condition';
                    } else if (trimmed.startsWith('elif ')) {
                      comment = 'Else-if condition';
                    } else if (trimmed.startsWith('else:')) {
                      comment = 'Else condition';
                    } else if (trimmed.startsWith('while ')) {
                      comment = 'While loop';
                    } else if (trimmed.startsWith('return ')) {
                      comment = 'Return value';
                    } else if (trimmed.startsWith('print(')) {
                      comment = 'Print output to console';
                    } else if (trimmed.includes('=') && !trimmed.includes('==')) {
                      if (trimmed.includes('[') && trimmed.includes(']')) {
                        comment = 'Define a list/array';
                      } else if (trimmed.includes('int(') || trimmed.includes('str(')) {
                        comment = 'Convert value to integer/string';
                      } else {
                        const varName = trimmed.split('=')[0].trim();
                        comment = `Assign value to variable "${varName}"`;
                      }
                    } else if (trimmed.includes('//') || trimmed.includes('%') || trimmed.includes('*')) {
                      comment = 'Perform arithmetic operation';
                    } else {
                      comment = 'Execute statement';
                    }
                    
                    return `${lineNum}. ${comment}`;
                  }).join('\n');
                })()}
              </pre>
            </div>
          </div>

          {response.output !== undefined && response.output !== null && (
            <div className="p-4 bg-white/5 border-t border-white/10">
              <span className="text-cyan-400 font-medium">Output</span>
              <pre className="mt-2 text-sm text-cyan-300 overflow-x-auto font-mono whitespace-pre-wrap">
                {response.output || "(No output)"}
              </pre>
            </div>
          )}

          {response.error && (
            <div className="p-4 bg-red-500/10 border-t border-red-500/30">
              <span className="text-red-400 font-medium">Error</span>
              <pre className="mt-2 text-sm text-red-300 overflow-x-auto font-mono whitespace-pre-wrap">
                {response.error}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const steps = [
    { title: "Plan", description: "AI analyzes your request and creates an execution strategy", icon: "📋" },
    { title: "Generate Code", description: "Autonomous agents write clean, optimized Python code", icon: "⚡" },
    { title: "Execute in Sandbox", description: "Safe code execution with full output capture", icon: "🔒" },
    { title: "Self-Heal Errors", description: "Automatic error detection and intelligent code fixing", icon: "🔄" },
  ];

  const features = [
    { title: "Autonomous Code Generation", description: "AI agents that understand intent and generate production-ready code instantly", icon: "🤖" },
    { title: "Self-Healing Debug Loop", description: "Automatic error detection, analysis, and intelligent code correction", icon: "🛠️" },
    { title: "Secure Code Execution", description: "Isolated sandbox environment with full system safety guarantees", icon: "🔐" },
    { title: "Multi-Agent Architecture", description: "Specialized AI agents working together for optimal code generation", icon: "🧠" },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      <FloatingOrb className="w-96 h-96 bg-cyan-500 top-20 -left-48" duration={25} />
      <FloatingOrb className="w-80 h-80 bg-purple-600 top-40 right-20" duration={30} />
      <FloatingOrb className="w-64 h-64 bg-cyan-400 bottom-40 left-1/3" duration={20} />

      <motion.div style={{ y }} className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
                Powered by AI Agents
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Mind-to-Code AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="min-h-[60px] mb-8"
            >
              <TypewriterText text="Turn ideas into self-healing code using autonomous AI agents" delay={800} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 0 40px rgba(34, 211, 238, 0.6), 0 20px 40px rgba(34, 211, 238, 0.3)",
                  rotateY: 5,
                  rotateX: -5
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("editor")}
                style={{ transformStyle: "preserve-3d" }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-full shadow-lg shadow-cyan-500/25"
              >
                Try Now
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "rgba(168, 85, 247, 0.8)",
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                  rotateY: -5,
                  rotateX: 5
                }}
                onClick={() => scrollToSection("features")}
                style={{ transformStyle: "preserve-3d" }}
                className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:border-purple-500/50 transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-cyan-400 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        <section id="editor" className="py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Try It Now</h2>
            <p className="text-gray-400 text-lg">Describe what you want to build</p>
          </motion.div>
          <CodeEditor />
        </section>

        <section className="py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Four steps to perfect code</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <StepCard key={i} number={i + 1} {...step} />
            ))}
          </div>
        </section>

        <section className="py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              See It In Action
            </motion.h2>
            <p className="text-gray-400 text-lg">Watch the self-healing magic unfold</p>
          </motion.div>
          <TerminalDemo />
        </section>

        <section id="features" className="py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.h2>
            <p className="text-gray-400 text-lg">Built for the future of coding</p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </section>

        <section className="py-32 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
            className="max-w-4xl mx-auto text-center p-16 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Ready to Build?
            </motion.h2>
            <p className="text-gray-400 text-lg mb-8">Experience the future of autonomous code generation</p>
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 0 50px rgba(34, 211, 238, 0.6), 0 25px 50px rgba(34, 211, 238, 0.4)",
                rotateY: 5,
                rotateX: -5
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("editor")}
              className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-lg rounded-full shadow-lg shadow-cyan-500/25"
            >
              Start Creating
            </motion.button>
          </motion.div>
        </section>

        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-500 text-sm">© 2026 Mind-to-Code AI</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
