import { motion, AnimatePresence } from "framer-motion";
import type { Generation } from "../types";

interface GenerationModalProps {
  generation: Generation | null;
  onClose: () => void;
  onRestore?: (generation: Generation) => void;
}

export function GenerationModal({
  generation,
  onClose,
  onRestore,
}: GenerationModalProps) {
  if (!generation) return null;

  const handleRestore = () => {
    if (onRestore) {
      onRestore(generation);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-black p-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-black tracking-tight">
              Generation Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Image */}
            {generation.imageUrl && (
              <div className="border-2 border-black">
                <img
                  src={generation.imageUrl}
                  alt={generation.prompt}
                  className="w-full"
                />
              </div>
            )}

            {/* Prompt */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-black">Prompt</h3>
              <p className="text-base text-zinc-800 bg-zinc-50 border-2 border-zinc-200 p-4">
                {generation.prompt}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              {generation.style && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-black">Style</h3>
                  <div className="inline-flex items-center px-4 py-2 text-sm font-bold bg-yellow-300 border-2 border-black">
                    {generation.style}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-black">Created</h3>
                <p className="text-sm text-zinc-700">
                  {new Date(generation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          {onRestore && (
            <div className="bg-white border-t-2 border-black p-6 flex gap-3 justify-end flex-shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-3 font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
              >
                Close
              </button>
              <button
                onClick={handleRestore}
                className="px-6 py-3 font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
              >
                Restore to Form
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
