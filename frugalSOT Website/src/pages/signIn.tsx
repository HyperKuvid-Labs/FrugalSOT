"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Github, Twitter, ArrowRight, Lock, Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import NeuronBackground from "../components/matrixBackground"

export default function SignInPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log({ email, password })
      // Handle form submission
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-hidden flex items-center justify-center">
      <NeuronBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <Link to="/" className="block mb-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-yellow-400 text-center">
              Frugal<span className="text-white">SOT</span>
            </motion.div>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute inset-0 bg-gradient-conic from-yellow-500 via-black to-yellow-500 rounded-xl p-[1px] animate-spin-slow"></div>

            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 relative overflow-hidden">
              <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

              <form onSubmit={onSubmit} className="space-y-6">
                <FloatingInput id="email" type="email" label="Email" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

                <FloatingInput id="password" type="password" label="Password" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-4 h-4 border border-yellow-500/50 rounded peer-checked:bg-yellow-500 peer-checked:border-yellow-500 transition-colors"></div>
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>

                  <a href="#" className="text-sm text-yellow-400 hover:underline">Forgot password?</a>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors flex items-center justify-center">
                  Sign In<ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </form>

              {/* Social Login */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-yellow-500/20"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-black px-2 text-gray-400">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<Github className="h-4 w-4" />} label="GitHub" />
                <SocialButton icon={<FaGoogle className="h-4 w-4" />} label="Google" />
              </div>

              {/* Signup link */}
              <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-yellow-400 hover:underline">Sign up</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FloatingInput({ id, type, label, icon, value, onChange, error }: { id: string; type: string; label: string; icon: React.ReactNode; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)

  useEffect(() => {
    setHasValue(value.length > 0)
  }, [value])

  return (
    <div className='relative group'>
      <input id={id} type={type} value={value} placeholder={label} onChange={(e) => { onChange(e); setHasValue(e.target.value.length > 0); }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} autoComplete='off' 
        className='w-full px-[2.5rem] py-[0.75rem] bg-transparent text-white outline-none border border-yellow-500/30 rounded-md focus:border-yellow-500 transition-colors' />
      
      {/* <label htmlFor={id} 
        className={`absolute left-[2.5rem] top-[50%] -translate-y-[50%] pointer-events-none transition-all duration-200 ${isFocused || hasValue ? '-translate-y-[1.7rem] scale-[0.75] text-yellow-400' : 'text-gray-400'}`}>
        {label}
      </label> */}

      {icon && (<span className={`absolute left-[0.75rem] top-[50%] -translate-y-[50%] ${isFocused || hasValue ? 'text-yellow-400' : 'text-gray-400'} transition-colors`}>{icon}</span>)}

      {error && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-red-500 text-xs mt-[0.25rem]'>{error}</motion.p>)}
    </div>
  )
}

// Social Button Component remains unchanged
function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => console.log(`Sign in with ${label}`)} 
        className='py-[0.5rem] px-[1rem] bg-black/50 border border-yellow-500/30 rounded-md flex items-center justify-center space-x-[0.5rem] hover:bg-yellow-500/10 transition-colors'>
        {icon}<span>{label}</span>
      </motion.button>
    )
  }