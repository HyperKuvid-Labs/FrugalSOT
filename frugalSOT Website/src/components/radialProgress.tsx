"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function RadialProgress({ value, label }: { value: number; label: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full" viewBox="0 0 40 40">
          {/* Background circle */}
          <circle cx="20" cy="20" r="18" fill="none" stroke="#333" strokeWidth="2" />

          {/* Progress circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />

          {/* Percentage text */}
          <text
            x="20"
            y="20"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFD700"
            fontSize="10"
            fontWeight="bold"
          >
            {progress}%
          </text>
        </svg>
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

