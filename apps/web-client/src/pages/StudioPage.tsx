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
    <div className="min-h-screen bg-bg-light dark:bg-dark-bg">
      <Navbar />

      {/* Server Connection Status */}
      {historyError && (
        <div className="bg-accent-orange dark:bg-dark-accent brutal-border border-t-0 border-l-0 border-r-0 brutal-shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-border dark:text-dark-bg"
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
              <p className="text-sm text-border dark:text-dark-bg font-bold">
                <strong>Cannot connect to backend server.</strong> Make sure the
                server is running on{" "}
                <code className="px-1 py-0.5 bg-bg-white dark:bg-dark-bg brutal-border">
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
            <div className="card-brutal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-border dark:text-dark-text uppercase">
                  Create Generation
                </h2>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-sm font-bold text-secondary dark:text-dark-primary hover:underline uppercase"
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
                    className="block text-sm font-bold text-border dark:text-dark-text mb-2 uppercase"
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
                    className="input-brutal w-full resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-bold text-border dark:text-dark-text mb-2 uppercase"
                  >
                    Style
                  </label>
                  <select
                    id="style"
                    name="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="input-brutal w-full"
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
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generateMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
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
                      </span>
                    ) : (
                      "Generate"
                    )}
                  </button>

                  {generateMutation.isPending && (
                    <button
                      type="button"
                      onClick={handleAbort}
                      className="btn-secondary px-6"
                    >
                      Abort
                    </button>
                  )}
                </div>

                {generateMutation.isError && !generateMutation.isPending && (
                  <div className="brutal-border bg-accent-orange dark:bg-dark-accent p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-border dark:text-dark-bg">
                        Generation failed. Please try again.
                      </p>
                      <button
                        type="button"
                        onClick={() => generateMutation.mutate()}
                        className="text-sm font-bold text-border dark:text-dark-bg hover:underline uppercase"
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
              <div className="card-brutal bg-primary dark:bg-dark-primary">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-border dark:text-dark-bg uppercase">
                    ✨ Latest Generation
                  </h3>
                  <button
                    onClick={() => setLatestGeneration(null)}
                    className="text-border dark:text-dark-bg hover:opacity-70 font-bold"
                    aria-label="Close result"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {latestGeneration.imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={`http://localhost:3000${latestGeneration.imageUrl}`}
                      alt={latestGeneration.prompt}
                      className="w-full brutal-border brutal-shadow"
                    />
                    <div className="text-sm text-border dark:text-dark-bg">
                      <p className="font-black mb-1 uppercase">Prompt:</p>
                      <p className="font-medium italic">
                        {latestGeneration.prompt}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-border dark:text-dark-bg uppercase">
                      Style: {latestGeneration.style}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-border dark:text-dark-bg font-bold">
                    <p>Generation completed but no image was created.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* History sidebar */}
          <div className="lg:col-span-1">
            <div className="card-brutal">
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
