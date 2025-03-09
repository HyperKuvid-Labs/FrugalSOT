"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function NeuronBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    const neurons = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 3 + 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]
        neuron.x += neuron.vx
        neuron.y += neuron.vy

        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)"
        ctx.shadowColor = "rgba(255, 255, 0, 0.5)"
        ctx.shadowBlur = 10
        ctx.fill()
      }

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x
          const dy = neurons[i].y - neurons[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(neurons[i].x, neurons[i].y)
            ctx.lineTo(neurons[j].x, neurons[j].y)
            ctx.strokeStyle = `rgba(255, 255, 0, ${1 - distance / 120})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
    />
  )
}
