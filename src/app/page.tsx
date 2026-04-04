"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
    <span className="text-gray-300 font-light tracking-wide text-lg md:text-xl">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-2 bg-indigo-500 ml-1 h-5 align-middle"
      />
    </span>
  );
}

function FloatingOrb({ className, duration = 20 }: { className: string; duration?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] opacity-40 mix-blend-screen ${className}`}
      animate={{ 
        y: [0, -60, 0], 
        x: [0, 40, 0], 
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0]
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function StepCard({ number, title, description, icon }: { number: number; title: string; description: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: number * 0.1, type: "spring", stiffness: 50 }}
      whileHover={{ y: -10 }}
      className="relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] group overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-teal-400/20 transition-colors duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl filter drop-shadow-lg">{icon}</div>
          <div className="text-indigo-400 font-bold text-sm tracking-widest uppercase">Step {number}</div>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-light">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-xl border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden group"
    >
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10">
        <div className="text-4xl mb-6 bg-white/[0.1] w-16 h-16 rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-inner">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-gray-400 font-light leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function TerminalDemo() {
  const [phase, setPhase] = useState(0);
  const lines = [
    { text: "$ python build_ai.py", color: "text-gray-300", delay: 0 },
    { text: "⚡ Initializing autonomous agent...", color: "text-indigo-400", delay: 500 },
    { text: "⚡ Analyzing architecture requirements...", color: "text-teal-400", delay: 1200 },
    { text: "⏳ Deploying to isolated sandbox...", color: "text-amber-400", delay: 2000 },
    { text: "✖ Error: Module 'neural_net' not found", color: "text-rose-400", delay: 3000 },
    { text: "🔧 Self-healing: resolving dependencies...", color: "text-purple-400", delay: 4200 },
    { text: "⚡ Re-executing pipeline...", color: "text-teal-400", delay: 5600 },
    { text: "✓ Build successful! Neural pathways active.", color: "text-emerald-400", delay: 6800 },
  ];

  useEffect(() => {
    if (phase < lines.length - 1) {
      const timer = setTimeout(() => setPhase(phase + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0A0A0C]/90 backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/[0.05]">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="text-gray-500 text-xs font-mono tracking-widest uppercase">agent-terminal v2.0</div>
        </div>
        <div className="p-8 font-mono text-sm h-80 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {lines.slice(0, phase + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                className={`${line.color} mb-3 flex items-start drop-shadow-md`}
              >
                <span className="mr-3 opacity-50 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                <span>{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {phase < lines.length - 1 && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="mt-2 text-teal-400 ml-7"
            >
              ▍
            </motion.div>
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse(null);

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

      if (newResponse.code) {
        setRunning(true);
        
        const runRes = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: newResponse.code }),
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
        error: "Generation failed constraint checks. Connection reset.",
      });
    } finally {
      setLoading(false);
      setRunning(false);
    }
  };

  const hasCode = response?.code && response.code.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="p-8">
          <label className="block text-indigo-300 text-sm tracking-widest uppercase mb-4 font-semibold">Neural Prompt Input</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-xl blur opacity-20 group-focus-within:opacity-50 transition duration-500" />
            <textarea
              className="relative w-full h-40 p-6 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 transition-all resize-none font-sans text-lg font-light leading-relaxed shadow-inner"
              placeholder="Describe the system architecture or logic you want to instantiate..."
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
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm tracking-wide">
                {loading ? "Synthesizing code..." : running ? "Executing in sandbox..." : "Press ⌘+Enter to execute"}
              </span>
              {(loading || running) && (
                <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="group relative px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 font-medium tracking-wide">
                {loading ? "Generating..." : "Deploy Agent"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {response && hasCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-8 rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-2xl flex flex-col"
        >
          {/* Code Box */}
          <div className="border-b border-white/5">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <span className="text-teal-400 font-mono text-sm tracking-widest uppercase">Generated Output</span>
              <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400 font-mono">Attempts: {response.attempts || 1}</span>
            </div>
            <div className="p-6 bg-[#050505] overflow-x-auto max-h-80 custom-scrollbar">
              <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                {(() => {
                  const lines = response.code.split('\n');
                  let lineNum = 0;
                  return lines.map((line, idx) => {
                    if (line.trim() === '' || line.trim().startsWith('#')) return null;
                    lineNum++;
                    return (
                      <div key={idx} className="flex">
                        <span className="w-8 text-gray-600 select-none text-right mr-4 inline-block">{lineNum}</span>
                        <span>{line}</span>
                      </div>
                    );
                  });
                })()}
              </pre>
            </div>
          </div>

          {/* Comments Box */}
          <div className="border-b border-white/5">
            <div className="px-6 py-4 border-b border-white/5 flex items-center bg-white/[0.02]">
              <span className="text-amber-400 font-mono text-sm tracking-widest uppercase">Execution Sequence Comments</span>
            </div>
            <div className="p-6 bg-[#0A0A0B] overflow-x-auto max-h-60 custom-scrollbar border-l-[3px] border-amber-500/30">
              <pre className="text-sm font-mono text-amber-200/80 leading-relaxed">
                {(() => {
                  const lines = response.code.split('\n');
                  let lineNum = 0;
                  return lines.map((line, idx) => {
                    if (line.trim() === '' || line.trim().startsWith('#')) return null;
                    lineNum++;
                    let comment = 'Execute statement';
                    const trimmed = line.trim();
                    if (trimmed.startsWith('def ')) {
                      const match = trimmed.match(/def\s+(\w+)\s*\((.*)\)/);
                      comment = match ? `Define function "${match[1]}" with parameters: ${match[2] || 'none'}` : 'Define function';
                    }
                    else if (trimmed.startsWith('for ')) comment = 'Loop through elements';
                    else if (trimmed.startsWith('if ')) comment = 'Check condition';
                    else if (trimmed.startsWith('elif ')) comment = 'Else-if condition';
                    else if (trimmed.startsWith('else:')) comment = 'Else condition';
                    else if (trimmed.startsWith('while ')) comment = 'While loop';
                    else if (trimmed.startsWith('return ')) comment = 'Return value';
                    else if (trimmed.startsWith('print(')) comment = 'Print output to console';
                    else if (trimmed.includes('=') && !trimmed.includes('==')) {
                      if (trimmed.includes('[') && trimmed.includes(']')) {
                        comment = 'Define a list/array';
                      } else {
                        const varName = trimmed.split('=')[0].trim();
                        comment = `Assign value to "${varName}"`;
                      }
                    } else if (trimmed.includes('//') || trimmed.includes('%') || trimmed.includes('*')) {
                      comment = 'Perform arithmetic operation';
                    }
                    
                    return (
                      <div key={idx} className="flex">
                        <span className="w-8 text-amber-600/50 select-none text-right mr-4 inline-block">{lineNum}</span>
                        <span>{comment}</span>
                      </div>
                    );
                  });
                })()}
              </pre>
            </div>
          </div>
          
          {/* Output Box */}
          <div className="flex flex-col">
            <div className="flex-1">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Execution Logs</span>
              </div>
              <div className="p-6 bg-[#050508] max-h-60 overflow-auto custom-scrollbar">
                {response.output ? (
                  <pre className="text-sm text-indigo-300 font-mono break-words whitespace-pre-wrap">
                    {response.output}
                  </pre>
                ) : (
                  <span className="text-gray-600 text-sm font-mono italic">Awaiting output...</span>
                )}
              </div>
            </div>
            
            {/* Error Box */}
            {response.error && (
              <div className="flex-1 bg-rose-500/5 border-t border-rose-500/10">
                <div className="px-6 py-4 border-b border-rose-500/10 bg-rose-500/10">
                  <span className="text-rose-400 font-mono text-sm tracking-widest uppercase">Diagnostics</span>
                </div>
                <div className="p-6 max-h-40 overflow-auto custom-scrollbar">
                  <pre className="text-sm text-rose-300 font-mono whitespace-pre-wrap">
                    {response.error}
                  </pre>
                </div>
              </div>
            )}
          </div>
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
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  const steps = [
    { title: "Define Intent", description: "Express your architecture in natural language. The neural engine creates the blueprint.", icon: "🧠" },
    { title: "Agentic Synthesis", description: "Multi-agent swarm writes, modules, and optimizes the code in real-time.", icon: "⚡" },
    { title: "Secure Sandbox", description: "Code is deployed to a sandboxed matrix for isolated execution and evaluation.", icon: "🛡️" },
    { title: "Auto-Heal Loop", description: "Runtime anomalies are detected and patched autonomously without human input.", icon: "🔄" },
  ];

  const features = [
    { title: "Cognitive Code Gen", description: "Moving beyond predictive text to true intent understanding and system generation.", icon: "🌌" },
    { title: "Self-Healing Architecture", description: "An infrastructure that detects its own faults and rewrites itself on the fly.", icon: "🧬" },
    { title: "Zero-Trust Execution", description: "Every compiled artifact is isolated, strictly monitored, and bound completely.", icon: "🔐" },
    { title: "Agent Swarm Logic", description: "Specialized modular agents debating and collaborating for optimal algorithms.", icon: "🕸️" },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(3,3,5,1))]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <FloatingOrb className="w-[500px] h-[500px] bg-indigo-600/30 top-0 -left-64" duration={25} />
      <FloatingOrb className="w-[400px] h-[400px] bg-teal-500/20 top-1/4 right-0" duration={32} />
      <FloatingOrb className="w-[600px] h-[600px] bg-purple-600/20 bottom-0 left-1/4" duration={28} />

      <motion.div style={{ y, opacity }} className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030305]/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#030305] rounded-[7px] flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">MindToCode</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-semibold text-gray-400">
              <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Platform</button>
              <button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors">Architecture</button>
            </div>
            <button 
              onClick={() => scrollToSection("editor")}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform"
            >
              Deploy
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="mb-8 inline-block"
            >
              <div className="px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-gray-300 text-sm font-medium tracking-wide">Next-Gen Agentic Framework</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white">Code at the</span><br />
              <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                speed of thought.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-12 max-w-2xl mx-auto"
            >
              <TypewriterText text="Architect complex systems through pure intent. Autonomous agents will handle the syntax, execution, and self-healing." delay={800} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex gap-6 justify-center flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("editor")}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Initialize Workbench
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Editor Section */}
        <section id="editor" className="py-40 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Workbench</h2>
            <p className="text-gray-400 text-xl font-light">Deploy agents directly into the runtime.</p>
          </motion.div>
          <CodeEditor />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-40 px-4 relative border-t border-white/5 bg-black/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Architecture</h2>
            <p className="text-gray-400 text-xl font-light">A unified pipeline from natural language to compiled execution.</p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <StepCard key={i} number={i + 1} {...step} />
            ))}
          </div>
        </section>

        {/* Terminal Demo Section */}
        <section className="py-40 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Live Diagnostics</h2>
            <p className="text-gray-400 text-xl font-light">Watch the swarm resolve dependencies in real-time.</p>
          </motion.div>
          <TerminalDemo />
        </section>

        {/* Features Section */}
        <section id="features" className="py-40 px-4 border-t border-white/5 bg-[#030305]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Platform Capabilities</h2>
            <p className="text-gray-400 text-xl font-light">Built for the next era of intelligent infrastructure.</p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto text-center p-20 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Ready to Ascend?</h2>
            <p className="text-gray-400 text-2xl font-light mb-12 max-w-2xl mx-auto">Experience the singularity of code generation natively in your browser.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("editor")}
              className="px-14 py-6 bg-gradient-to-r from-indigo-500 to-teal-400 text-white font-bold text-xl rounded-full shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              Launch Platform
            </motion.button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-teal-400 p-[1px]">
                <div className="w-full h-full bg-black rounded-[3px]" />
              </div>
              <span className="font-bold text-lg tracking-tight">MindToCode</span>
            </div>
            <p className="text-gray-600 text-sm tracking-wide">© 2026 Neural Engineering Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Manifesto</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">System Status</a>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
