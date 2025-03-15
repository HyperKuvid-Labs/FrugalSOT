"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ModelData {
  name: string
  complexity: string
  threshold: string
  specs: {
    parameters: string
    memory: string
    speed: string
  }
}

export default function ModelPyramid() {
  const [activeModel, setActiveModel] = useState<string | null>(null)

  const models: ModelData[] = [
    {
      name: "Phi 2.7B",
      complexity: "Very High",
      threshold: "N/A (Fallback)",
      specs: {
        parameters: "2.7 Billion",
        memory: "7.4 GB",
        speed: "240s avg.",
      },
    },
    {
      name: "Gemma2 2B",
      complexity: "High",
      threshold: "0.6934",
      specs: {
        parameters: "2 Billion",
        memory: "4 GB",
        speed: "200s avg.",
      },
    },
    {
      name: "TinyDolphin",
      complexity: "Mid",
      threshold: "0.6537",
      specs: {
        parameters: "1.1 Billion",
        memory: "2.2 GB",
        speed: "100s avg.",
      },
    },
    {
      name: "TinyLlama",
      complexity: "Low",
      threshold: "0.4441",
      specs: {
        parameters: "1.1 Billion",
        memory: "2 GB",
        speed: "80s avg.",
      },
    },
  ]

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
      {/* Pyramid */}
      <div className="relative w-full max-w-md h-[400px] flex flex-col items-center">
        {models.map((model, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="absolute"
            style={{ top: `${index * 100}px` }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setActiveModel(model.name)}
              onHoverEnd={() => setActiveModel(null)}
              className={`relative cursor-pointer transition-all duration-300 ${
                activeModel === model.name ? "z-20" : "z-10"
              }`}
            >
              <div
                className={`w-${80 - index * 15} h-16 bg-black border border-yellow-500/30 rounded-md flex items-center justify-center backdrop-blur-md ${
                  activeModel === model.name ? "bg-yellow-500/20" : "bg-black/50"
                }`}
                style={{ width: `${400 - index * 40}px` }}
              >
                <div className="text-center">
                  <div className="font-bold text-yellow-400">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.complexity} Complexity</div>
                </div>
              </div>

              {/* Model details popup */}
              <AnimatedDetails
                isVisible={activeModel === model.name}
                model={model}
                position={index < 2 ? "bottom" : "top"}
              />

              {/* Connecting lines */}
              {index < models.length - 1 && (
                <>
                  <div className="absolute left-0 bottom-0 w-px h-[84px] bg-yellow-500/30"></div>
                  <div className="absolute right-0 bottom-0 w-px h-[84px] bg-yellow-500/30"></div>
                </>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AnimatedDetails({
  isVisible,
  model,
  position,
}: {
  isVisible: boolean
  model: ModelData
  position: "top" | "bottom"
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === "top" ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? -10 : 10 }}
          className={`absolute ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 right-0 bg-black border border-yellow-500/30 rounded-md p-3 backdrop-blur-md z-30`}
        >
          <div className="text-sm mb-2">
            <span className="text-gray-400">Threshold:</span>{" "}
            <span className="text-yellow-400 font-medium">{model.threshold}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-black/50 p-2 rounded border border-yellow-500/20">
              <div className="text-gray-400">Parameters</div>
              <div className="text-white font-medium">{model.specs.parameters}</div>
            </div>
            <div className="bg-black/50 p-2 rounded border border-yellow-500/20">
              <div className="text-gray-400">Memory</div>
              <div className="text-white font-medium">{model.specs.memory}</div>
            </div>
            <div className="bg-black/50 p-2 rounded border border-yellow-500/20">
              <div className="text-gray-400">Speed</div>
              <div className="text-white font-medium">{model.specs.speed}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

