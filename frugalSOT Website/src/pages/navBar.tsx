"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-bold text-xl text-yellow-400"
              >
                DEVHUB
              </motion.div>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} active={location.pathname === item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/sign-in">
              <button className="text-white hover:text-yellow-400">
                Sign in
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded">
                Sign up
              </button>
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-zinc-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? "bg-zinc-800 text-yellow-400"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-yellow-400"
                  } transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full justify-start text-white hover:text-yellow-400">
                    Sign in
                  </button>
                </Link>
                <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={href} className="relative">
      <span
        className={`text-sm font-medium ${active ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"} transition-colors`}
      >
        {children}
      </span>
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  )
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Documentation" },
]

