"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Github, Twitter, ArrowRight, Lock, Mail, User, Check } from "lucide-react"
import NeuronBackground from "../components/matrixBackground"
import { useForm } from "react-hook-form"

type FormData = {
  name: string
  email: string
  password: string
  terms: boolean
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const [passwordStrength, setPasswordStrength] = useState(0)
  const password = watch("password", "")

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Handle form submission
  }

  useEffect(() => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [password])

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-hidden flex items-center justify-center py-12">
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
              <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FloatingInput id="name" type="text" label="Full Name" icon={<User />} register={register("name", { required: "Name is required" })} error={errors.name?.message} />

                <FloatingInput id="email" type="email" label="Email" icon={<Mail />} register={register("email", { required: "Email is required", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email address" } })} error={errors.email?.message} />

                <FloatingInput id="password" type="password" label="Password" icon={<Lock />} register={register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum length is 8 characters" } })} error={errors.password?.message} />

                <PasswordStrengthMeter strength={passwordStrength} />

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="sr-only peer" {...register("terms", { required: true })} />
                  <div className="w-4 h-4 border border-yellow-500/50 rounded peer-checked:bg-yellow-500 peer-checked:border-yellow-500 transition-colors flex items-center justify-center">
                    <Check className="h-3 w-3 text-black opacity-0 peer-checked:opacity-100" />
                  </div>
                  <label htmlFor="terms" className="text-sm text-gray-400">I agree to the <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a> and <a href="#" className="text-yellow-400 hover:underline">Privacy Policy</a></label>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-yellow-500 text-black rounded-md font-medium hover:bg-yellow-400 transition-colors flex items-center justify-center">
                  Create Account<ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </form>

              {/* Social Login */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-yellow-500/20"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-black px-2 text-gray-400">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<Github />} label="GitHub" />
                <SocialButton icon={<Twitter />} label="Twitter" />
              </div>

              {/* Sign-in link */}
              <p className='mt-6 text-sm text-gray-400 text-center'>Already have an account?{" "}
                <Link to='/sign-in' className='text-yellow-400 hover:underline'>Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ✅ Corrected Floating Input Component
function FloatingInput({ id, type, label, icon, register, error }: { id: string; type: string; label: string; icon?: React.ReactNode; register?: any; error?: string }) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <div className='relative'>
      {icon && (<span className={`absolute left-[0.75rem] top-[50%] -translate-y-[50%] ${isFocused || hasValue ? 'text-yellow-400' : 'text-gray-400'} transition-colors`}>{icon}</span>)}
      <input {...register} id={id} type={type} placeholder={label} autoComplete='off'
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value !== "") }}
        onChange={(e) => setHasValue(e.target.value !== "")}
        className='w-full px-[2.5rem] py-[0.75rem] bg-transparent outline-none border border-yellow-500/30 rounded-md focus:border-yellow-500 transition-colors' />
      {/* <label htmlFor={id} 
        className={`absolute left-[2.5rem] top-[50%] -translate-y-[50%] pointer-events-none transition-all duration-200 ${isFocused || hasValue ? '-translate-y-[1.7rem] scale-[0.75] text-yellow-400' : 'text-gray-400'}`}>
        {label}
      </label> */}
      {error && (<p className='text-red-500 text-xs mt-[0.25rem]'>{error}</p>)}
    </div>
  )
}

// Password Strength Meter Component
function PasswordStrengthMeter({ strength }: { strength: number }) {
  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return "Weak"
      case 1:
        return "Fair"
      case 2:
        return "Good"
      case 3:
        return "Strong"
      case 4:
        return "Very Strong"
      default:
        return "Weak"
    }
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-orange-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-emerald-500"
      default:
        return "bg-red-500"
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="text-xs text-yellow-400">{getStrengthLabel()}</span>
      </div>
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${getStrengthColor()}`}
        />
      </div>
    </div>
  )
}

// Social Button Component
function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="py-2 px-4 bg-black/50 border border-yellow-500/30 rounded-md flex items-center justify-center space-x-2 hover:bg-yellow-500/10 transition-colors"
      onClick={() => console.log(`Sign up with ${label}`)}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

