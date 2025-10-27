"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ClickableImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  priority = false,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`cursor-zoom-in ${className} object-cover overflow-hidden`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="max-w-[80vw] max-h-[90vh] w-auto h-auto"
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-contain w-full h-full overflow-scroll"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
