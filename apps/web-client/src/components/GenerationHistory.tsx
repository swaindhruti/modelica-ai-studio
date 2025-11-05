import { motion, AnimatePresence } from "framer-motion";
import type { Generation } from "../types";
import { generationsApi } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

interface GenerationHistoryProps {
  generations: Generation[];
  isLoading: boolean;
  onRestore: (generation: Generation) => void;
  onView: (generation: Generation) => void;
}

export function GenerationHistory({
  generations,
  isLoading,
  onRestore,
  onView,
}: GenerationHistoryProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate how many items to show per view based on screen width
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, generations.length - itemsPerView);

  const scrollTo = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const itemWidth =
        scrollContainerRef.current.scrollWidth / generations.length;
      scrollContainerRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollTo(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollTo(newIndex);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => generationsApi.delete(id),
    onSuccess: () => {
      toast.success("Generation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      setDeletingId(null);
    },
    onError: (error: unknown) => {
      console.error("Delete generation error:", error);
      const err = error as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete generation";
      toast.error(errorMessage);
      setDeletingId(null);
    },
  });

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this generation?")) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const handleView = (e: React.MouseEvent, generation: Generation) => {
    e.stopPropagation();
    onView(generation);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Recent Generations
        </h2>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-zinc-200 border-2 border-zinc-300 flex-shrink-0"
              style={{ width: "280px", height: "380px" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Recent Generations
        </h2>
        <div className="bg-zinc-50 border-2 border-zinc-200 p-12 text-center">
          <p className="text-sm text-zinc-600 font-medium">
            No generations yet. Create your first one!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Recent Generations
        </h2>

        {/* Navigation Buttons */}
        {generations.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-11 h-11 flex items-center justify-center bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-11 h-11 flex items-center justify-center bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Next"
            >
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <AnimatePresence mode="popLayout">
            {generations.map((generation) => (
              <motion.div
                key={generation.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 flex-shrink-0"
                style={{
                  width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
                }}
              >
                {generation.imageUrl && (
                  <div className="relative w-full aspect-square">
                    <img
                      src={generation.imageUrl}
                      alt={generation.prompt}
                      className="w-full h-full border-b-2 border-black object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <p className="text-sm font-semibold text-black line-clamp-2 mb-3">
                    {generation.prompt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {generation.style && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-yellow-300 border border-black">
                        {generation.style}
                      </span>
                    )}
                    <span className="text-xs text-zinc-600 font-medium">
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t-2 border-black">
                  <button
                    onClick={(e) => handleView(e, generation)}
                    disabled={deletingId === generation.id}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-black hover:bg-green-500 transition-colors border-r-2 border-black disabled:opacity-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onRestore(generation)}
                    disabled={deletingId === generation.id}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-black hover:bg-yellow-300 transition-colors border-r-2 border-black disabled:opacity-50"
                  >
                    Restore
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, generation.id)}
                    disabled={deletingId === generation.id}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {deletingId === generation.id ? "..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      {generations.length > itemsPerView && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 border-2 border-black transition-all duration-150 ${
                currentIndex === index
                  ? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-zinc-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
