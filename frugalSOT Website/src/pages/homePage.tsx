"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, BarChart3, Github, ArrowRight, Mail } from "lucide-react";
import NeuronBackground from "../components/matrixBackground";
import ModelPyramid from "../components/modelPyramid";
// import ComplexityCalculator from "@/components/complexity-calculator"

export default function HomePage() {
  const controls = useAnimation();
  const [_, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [controls]);

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-hidden w-full">
      <NeuronBackground />
      {/* <ParticleTrail mousePosition={mousePosition} /> */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-yellow-400"
            >
              Frugal<span className="text-white">SOT</span>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Link to="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 text-sm bg-black/50 border border-yellow-500/30 rounded-md backdrop-blur-md hover:bg-yellow-500/10 transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 text-sm bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-4 inline-block"
              >
                <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs text-yellow-400 backdrop-blur-md">
                  EDGE AI OPTIMIZATION FRAMEWORK
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Run AI models on <br />
                <span className="text-yellow-400">
                  resource-constrained
                </span>{" "}
                devices
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-gray-400 mb-8 max-w-lg"
              >
                FrugalSOT dynamically selects the optimal model based on request
                complexity, enabling efficient AI inference on edge devices like
                Raspberry Pi 5.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors flex items-center"
                  >
                    Signup to get the Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </Link>
                <Link to="https://github.com/HARISH20205/RPI/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black/50 border border-yellow-500/30 rounded-md backdrop-blur-md hover:bg-yellow-500/10 transition-colors flex items-center"
                  >
                    View on GitHub
                    <Github className="ml-2 h-4 w-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* RPI Model */}
                <div className="relative h-[300px] sm:h-[400px] w-full sm:w-auto flex items-center justify-center">
                  <div className="w-48 sm:w-64 h-48 sm:h-64 relative">
                    <motion.div
                      animate={{
                        rotateY: [0, 360],
                        rotateX: [10, 30, 10],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-full h-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 rounded-xl border border-yellow-500/30 backdrop-blur-md transform perspective-1000 rotateX(10deg)"></div>
                      <div className="absolute inset-2 bg-black/80 rounded-lg flex items-center justify-center">
                        <Cpu className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400" />
                      </div>
                      <div className="absolute -top-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full blur-sm"></div>
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full blur-sm"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Metrics Cards */}
                <div className="flex flex-col gap-4 w-full px-4 justify-center items-center">
                  {/* Execution Time Card */}
                  <MetricsCard
                    title="Execution Time"
                    metrics={[
                      { label: "tinyllama", value: "80s" },
                      { label: "tinydolphin", value: "100s" },
                      { label: "Gemma2:2b", value: "200s" },
                      { label: "Phi:2.7b", value: "240s" },
                    ]}
                    icon={<Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 flex" />}
                    delay={0.7}
                  />

                  {/* Relevance Thresholds Card */}
                  <MetricsCard
                    title="Relevance Thresholds"
                    metrics={[
                      { label: "Low", value: "0.4441" },
                      { label: "Mid", value: "0.6537" },
                      { label: "High", value: "0.6934" },
                      {
                        label:
                          "The results above are after so many trials and tests of validating 100 prompts of each complexity, will now update dynamically",
                        value: "",
                      },
                    ]}
                    icon={<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />}
                    delay={0.8}
                  />

                  {/* Complexity Scores Card */}
                  <MetricsCard
                    title="Complexity Scores"
                    metrics={[
                      { label: "Low", value: "<=4" },
                      { label: "Mid", value: "<=8" },
                      { label: "High", value: ">8" },
                      {
                        label:
                          "The complexity score is calculated on the basis of number of words in the prompt, Named Entity Recognition (NER), and Syntactic Complexity",
                        value: "",
                      },
                    ]}
                    icon={<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />}
                    delay={0.8}
                  />
                </div>
              </div>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Model Visualization */}
      {/* Model Visualization */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-yellow-900/5 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Model <span className="text-yellow-400">Tiering</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              FrugalSOT dynamically selects the most appropriate model based on
              request complexity, optimizing for both performance and relevance.
              This dynamic stack is specifically optimized for{" "}
              <b>Raspberry Pi 5</b>, adjusting in real-time to device
              constraints.
            </p>
          </motion.div>

          <div className="grid gap-8 items-center">
            {/* Model Pyramid - Reduced width */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[450px] flex items-center justify-center"
            >
              <ModelPyramid />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-yellow-500/20 py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold text-yellow-400 mb-2">
                Frugal<span className="text-white">SOT</span>
              </div>
              <p className="text-gray-400 text-sm">
                Efficient AI inference on resource-constrained devices.
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://github.com/HARISH20205/RPI"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:frugalsot@gmail.com"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Gmail</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Metrics Card Component
function MetricsCard({
  title,
  metrics,
  icon,
  delay = 0,
  customContent = null,
}: {
  title: string;
  metrics: { label: string; value: string }[];
  icon: React.ReactNode;
  delay?: number;
  customContent?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="bg-black/50 backdrop-blur-md border border-yellow-500/30 rounded-lg p-4 w-64 overflow-hidden relative"
    >
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>

      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-medium ml-2">{title}</h3>
      </div>

      {customContent ? (
        customContent
      ) : (
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{metric.label}</span>
              <span className="text-sm font-medium text-yellow-400">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Clock Icon Component
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
