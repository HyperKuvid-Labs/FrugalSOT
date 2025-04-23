import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ChevronRight, Mail, Github } from "lucide-react";

export default function DocumentationPage() {
  const [pdfLink, _] = useState(
    "https://drive.google.com/file/d/1ieGhM26ERgIc7z43Amjy4EK_CAATEVM0/view?usp=sharing"
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-yellow-500/20">
        <div className="container mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {/* <Terminal className="h-8 w-8 text-yellow-400" /> */}
            <h1 className="text-2xl font-bold text-yellow-400">FrugalSOT</h1>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-yellow-400">Thank you</span> for signing up
              with us
            </h2>

            <p className="text-lg text-gray-300 mb-8">
              This is our documentation. Please download and suggest solutions.
              CLI tool😉 - <a href="https://github.com/HyperKuvid-Labs/FrugalSOT-CLI">FrugalSOT-CLI</a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="rounded-lg bg-zinc-900 border border-yellow-500/20 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-yellow-400">
                      Documentation PDF
                    </h3>
                    <p className="text-gray-400">
                      Complete guide with examples and best practices
                    </p>
                  </div>

                  <a
                    href={pdfLink}
                    download
                    className="inline-flex items-center justify-center rounded-md bg-yellow-500 hover:bg-yellow-600 px-4 py-2 text-black font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-medium mb-4 text-yellow-400">
              How to contribute
            </h3>

            <div className="mt-8">
              <div className="flex items-center space-x-6">
                <button className="inline-flex items-center justify-center rounded-md border border-yellow-500 text-yellow-400 px-4 py-2 hover:bg-yellow-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black">
                  Provide Feedback
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
                <a
                  href="https://github.com/HyperKuvid-Labs/FrugalSOT"
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
          </motion.div>
        </div>
      </main>

      {/* <footer className="border-t border-yellow-500/20 py-6">
      </footer> */}
    </div>
  );
}
