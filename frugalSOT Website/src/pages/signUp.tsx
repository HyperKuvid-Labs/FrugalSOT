"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Github, ArrowRight, Lock, Mail, User } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import NeuronBackground from "../components/matrixBackground"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!name) {
      newErrors.name = "Name is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = "Invalid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Minimum length is 8 characters"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log({ name, email, password })
      try{
        const resp = await axios.post("http://localhost:5000/api/sign-up", {name, email, password});
        console.log("SignUp successfull", resp.data);
        navigate('/documentationDownload');
      }catch(err){
        console.error('Error during signup:', err);
      }
    }
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

              <form onSubmit={onSubmit} className="space-y-6">
                <FloatingInput
                  id="name"
                  type="text"
                  label="Full Name"
                  icon={<User />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />

                <FloatingInput
                  id="email"
                  type="email"
                  label="Email"
                  icon={<Mail />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <FloatingInput
                  id="password"
                  type="password"
                  label="Password"
                  icon={<Lock />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <PasswordStrengthMeter strength={passwordStrength} />

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
                <SocialButton icon={<FaGoogle />} label="Google" />
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

function FloatingInput({ id, type, label, icon, value, onChange, error }: { id: string; type: string; label: string; icon?: React.ReactNode; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string }) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(value !== "")

  return (
    <div className='relative'>
      {icon && (<span className={`absolute left-[0.75rem] top-[50%] -translate-y-[50%] ${isFocused || hasValue ? 'text-yellow-400' : 'text-gray-400'} transition-colors`}>{icon}</span>)}
      <input id={id} type={type} value={value} placeholder={label} autoComplete='off'
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value !== "") }}
        onChange={(e) => { onChange(e); setHasValue(e.target.value !== "") }}
        className='w-full px-[2.5rem] py-[0.75rem] bg-transparent outline-none border border-yellow-500/30 rounded-md focus:border-yellow-500 transition-colors' />
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