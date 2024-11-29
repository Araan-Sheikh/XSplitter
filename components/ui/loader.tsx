'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn(
      "h-screen w-screen fixed inset-0 z-50 flex items-center justify-center bg-background",
      className
    )}>
      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo and Spinning Rings */}
        <motion.div
          className="mb-8 relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center p-4 relative">
            {/* Spinning Ring Animation */}
            <motion.div
              className="absolute inset-0 border-t-2 border-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Logo */}
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="w-20 h-20 relative z-10"
              />
            </motion.div>

            {/* Pulsing Rings */}
            <motion.div
              className="absolute inset-0 border-2 border-primary/30 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-primary/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        </motion.div>

        {/* Loading Text and Dots */}
        <motion.div
          className="flex items-center gap-3 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {/* Loading Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          <span className="text-sm">Loading data...</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 