import { motion, AnimatePresence } from "framer-motion";
import type { Generation } from "../types";

interface GenerationHistoryProps {
  generations: Generation[];
  isLoading: boolean;
  onRestore: (generation: Generation) => void;
}

export function GenerationHistory({
  generations,
  isLoading,
  onRestore,
}: GenerationHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Generations
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Generations
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No generations yet. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recent Generations
      </h2>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {generations.map((generation) => (
            <motion.button
              key={generation.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRestore(generation)}
              className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="flex gap-4">
                {generation.imageUrl && (
                  <img
                    src={`http://localhost:3000${generation.imageUrl}`}
                    alt={generation.prompt}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {generation.style && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {generation.style}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
