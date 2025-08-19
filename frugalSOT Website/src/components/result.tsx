"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconX } from "@tabler/icons-react";

export default function Results() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto p-6 space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full"
        >
            <div
              className={cn(
                "group w-full cursor-pointer overflow-hidden relative card h-[378px] rounded-[20px] shadow-2xl mx-auto flex flex-col justify-end p-8",
                "bg-[url(/frugalsot_result_actual.png)] bg-contain bg-center bg-no-repeat",
                "hover:scale-[1.02] transition-all duration-500 ease-out"
              )}
              onClick={() => setIsModalOpen(true)}
            >
              {/* Enhanced overlay with yellow accent */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-yellow-400/10 group-hover:from-black/95"></div> */}
              
              {/* Content */}
              <br />
              <br />
              <div className="relative z-50 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-4"
                > 
                    <div className="bg-black/95 backdrop-blur-sm p-6 rounded-[14px] border border-yellow-400/30">
                      <motion.h1 
                        whileHover={{ scale: 1.02 }}
                        className="font-bold text-xl md:text-2xl text-yellow-400 mb-3 tracking-tight"
                      >
                        Performance Analysis
                      </motion.h1>
                      <p className="text-white/90 leading-relaxed text-sm mb-4">
                        Intelligent model selection achieving superior performance on resource-constrained devices. 
                        Relevance score of <strong className="text-yellow-400">0.844</strong> with <strong className="text-yellow-400">21.34% time reduction</strong> compared to Phi 3.7b <b>(The ultimate model)</b>.
                      </p>
                    </div>
                </motion.div>
              </div>
            </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Transparent background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
              >
                <IconX className="w-6 h-6 text-white" />
              </button>
              
              {/* Image */}
              <img
                src="/frugalsot_result_actual.png"
                alt="FrugalSOT Results"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
