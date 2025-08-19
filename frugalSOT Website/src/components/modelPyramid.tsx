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

  const modelsUnder8GB: ModelData[] = [
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

  const modelsOver8GB: ModelData[] = [
    {
      name: "Llama2 13B",
      complexity: "Very High",
      threshold: "N/A (Fallback)",
      specs: {
        parameters: "13 Billion",
        memory: "≈ 16 GB",
        speed: "13s avg.",
      },
    },
    {
      name: "Llama3.1 8B",
      complexity: "High",
      threshold: "0.7302",
      specs: {
        parameters: "8 Billion",
        memory: "≈ 14 GB",
        speed: "7s avg.",
      },
    },
    {
      name: "Mistral 7B",
      complexity: "Mid",
      threshold: "0.7134",
      specs: {
        parameters: "7 Billion",
        memory: "≈ 13 GB",
        speed: "5s avg.",
      },
    },
    {
      name: "Llama3.2 3B",
      complexity: "Low",
      threshold: "0.6218",
      specs: {
        parameters: "3 Billion",
        memory: "≈ 10 GB",
        speed: "2s avg.",
      },
    },
  ]

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Column Headers */}
      <div className="flex justify-center gap-30 md:gap-40 mb-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">&lt;8GB Models</h3>
          <p className="text-sm text-gray-400">Memory Constrained</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">&gt;8GB Models</h3>
          <p className="text-sm text-gray-400">High Performance</p>
        </div>
      </div>

      {/* Dual Pyramids with Separator */}
      <div className="flex justify-center items-center gap-30 md:gap-40">
        <PyramidColumn models={modelsUnder8GB} activeModel={activeModel} setActiveModel={setActiveModel} />

        <div className="h-[400px] md:h-[600px] w-0.5 bg-gradient-to-b from-transparent via-yellow-500/40 to-transparent shadow-lg shadow-yellow-500/20"></div>

        <PyramidColumn models={modelsOver8GB} activeModel={activeModel} setActiveModel={setActiveModel} />
      </div>
    </div>
  )
}

function PyramidColumn({
  models,
  activeModel,
  setActiveModel,
}: {
  models: ModelData[]
  activeModel: string | null
  setActiveModel: (model: string | null) => void
}) {
  return (
    <div className="relative w-full max-w-md h-[400px] md:h-[600px] flex flex-col items-center">
      {models.map((model, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute"
          style={{
            top: `${index * (100 + (window.innerWidth < 768 ? 20 : 0))}px`,
          }}
        >
          <motion.div
            whileTap={{ scale: 1.05 }}
            onTap={() => setActiveModel(model.name)}
            onHoverStart={() => setActiveModel(model.name)}
            onHoverEnd={() => setActiveModel(null)}
            className={`relative cursor-pointer transition-all duration-300 ${
              activeModel === model.name ? "z-20" : "z-10"
            }`}
          >
            <div
              className={`h-16 md:h-20 bg-black border border-yellow-500/30 rounded-md flex items-center justify-center backdrop-blur-md ${
                activeModel === model.name ? "bg-yellow-500/20" : "bg-black/50"
              }`}
              style={{
                width: `${400 - index * (40 + (window.innerWidth < 768 ? 10 : 0))}px`,
              }}
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
                <div className="absolute left-0 bottom-0 w-px bg-yellow-500/30"></div>
                <div className="absolute right-0 bottom-0 w-px bg-yellow-500/30"></div>
              </>
            )}
          </motion.div>
        </motion.div>
      ))}
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
