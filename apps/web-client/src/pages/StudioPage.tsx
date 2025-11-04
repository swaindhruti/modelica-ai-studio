import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generationsApi } from "../lib/api";
import { ImageUpload } from "../components/ImageUpload";
import { GenerationHistory } from "../components/GenerationHistory";
import { Navbar } from "../components/Navbar";
import toast from "react-hot-toast";
import type { ApiError, Generation } from "../types";

const STYLES = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "cartoon", label: "Cartoon" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil Painting" },
];

export function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0].value);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [latestGeneration, setLatestGeneration] = useState<Generation | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Fetch generations history
  const {
    data: generationsData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["generations"],
    queryFn: async () => {
      const response = await generationsApi.list();
      return response.data.generations;
    },
    retry: 1,
  });

  // Show error toast if history fetch fails
  if (historyError && !isLoadingHistory) {
    const error = historyError as ApiError;
    if (!error?.response) {
      toast.error(
        "Cannot connect to server. Please ensure the backend is running.",
        { id: "history-error" }
      );
    }
  }

  // Create generation mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("style", style);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      abortControllerRef.current = new AbortController();
      const response = await generationsApi.create(
        formData,
        abortControllerRef.current.signal
      );
      return response.data;
    },
    retry: (failureCount, error: ApiError) => {
      // Retry up to 3 times only for 503 errors
      if (error?.response?.status === 503 && failureCount < 3) {
        toast.error(`Model overloaded. Retry ${failureCount + 1}/3...`);
        return true;
      }
      return false;
    },
    retryDelay: 1000,
    onSuccess: (data) => {
      toast.success("Generation created successfully!");

      // Store the latest generation to display
      setLatestGeneration(data);

      // Invalidate and refetch generations
      queryClient.invalidateQueries({ queryKey: ["generations"] });

      // DON'T reset form - keep it for easy regeneration
      // User can manually clear if they want a new generation
      abortControllerRef.current = null;
    },
    onError: (error: ApiError) => {
      console.error("Generation error:", error);

      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        toast.error("Generation cancelled");
      } else if (error?.response?.status === 503) {
        toast.error("🔥 Model overloaded! Please try again in a moment.");
      } else if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 400) {
        // Handle Zod validation errors or bad request
        const errorData = error?.response?.data as Record<string, unknown>;
        let errorMessage = "Invalid request";

        if (errorData?.error) {
          // If error is a string, use it
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          }
          // If it's a Zod error object, extract the message
          else if (
            typeof errorData.error === "object" &&
            errorData.error !== null
          ) {
            const errObj = errorData.error as Record<string, unknown>;
            if (errObj.message && typeof errObj.message === "string") {
              errorMessage = errObj.message;
            }
            // If it's an array of issues (Zod format)
            else if (Array.isArray(errObj.issues)) {
              errorMessage = errObj.issues
                .map((issue: Record<string, unknown>) => issue.message)
                .filter((msg): msg is string => typeof msg === "string")
                .join(", ");
            }
          }
        } else if (
          errorData?.message &&
          typeof errorData.message === "string"
        ) {
          errorMessage = errorData.message;
        }

        toast.error(errorMessage);
      } else if (!error?.response) {
        toast.error(
          "Network error. Please check your connection and that the backend server is running."
        );
      } else {
        const errorMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Generation failed";
        toast.error(
          typeof errorMsg === "string" ? errorMsg : "Generation failed"
        );
      }
      abortControllerRef.current = null;
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    generateMutation.mutate();
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      generateMutation.reset();
    }
  };

  const handleRestore = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style || STYLES[0].value);
    if (generation.imageUrl) {
      setImagePreview(`http://localhost:3000${generation.imageUrl}`);
    }
    // Clear latest generation when restoring from history
    setLatestGeneration(null);
    toast.success("Generation restored to form");
  };

  const handleClearForm = () => {
    setPrompt("");
    setStyle(STYLES[0].value);
    setImageFile(null);
    setImagePreview(null);
    setLatestGeneration(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Server Connection Status */}
      {historyError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>Cannot connect to backend server.</strong> Make sure the
                server is running on{" "}
                <code className="px-1 py-0.5 bg-red-100 dark:bg-red-800/30 rounded">
                  http://localhost:3000
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main generation form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Generation
                </h2>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Clear Form
                </button>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <ImageUpload
                  onImageSelect={(file, preview) => {
                    setImageFile(file);
                    setImagePreview(preview);
                  }}
                  preview={imagePreview}
                />

                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Prompt *
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={4}
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Style
                  </label>
                  <select
                    id="style"
                    name="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    {STYLES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>

                  {generateMutation.isPending && (
                    <button
                      type="button"
                      onClick={handleAbort}
                      className="px-4 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Abort
                    </button>
                  )}
                </div>

                {generateMutation.isError && !generateMutation.isPending && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="flex">
                      <div className="flex-1">
                        <p className="text-sm text-red-800 dark:text-red-400">
                          Generation failed. Please try again.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => generateMutation.mutate()}
                        className="ml-3 text-sm font-medium text-red-800 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Latest Generation Result */}
            {latestGeneration && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ✨ Latest Generation
                  </h3>
                  <button
                    onClick={() => setLatestGeneration(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close result"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {latestGeneration.imageUrl ? (
                  <div className="space-y-3">
                    <img
                      src={`http://localhost:3000${latestGeneration.imageUrl}`}
                      alt={latestGeneration.prompt}
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Prompt:
                      </p>
                      <p className="italic">{latestGeneration.prompt}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Style: {latestGeneration.style}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Generation completed but no image was created.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* History sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <GenerationHistory
                generations={generationsData || []}
                isLoading={isLoadingHistory}
                onRestore={handleRestore}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
