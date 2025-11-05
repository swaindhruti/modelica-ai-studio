import { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";
import { GenerationHistory } from "../components/GenerationHistory";
import { GenerationModal } from "../components/GenerationModal";
import { Navbar } from "../components/Navbar";
import toast from "react-hot-toast";
import type { Generation } from "../types";
// Using Cloudinary for direct client-side uploads
import { useGenerate, useImageUpload, useGenerations } from "../hooks";

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
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);

  // Custom hooks
  const {
    generations,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useGenerations();
  const {
    imageUrl,
    imagePreview,
    upload,
    isUploading,
    setImagePreview,
    clearImage,
    setImageUrl,
  } = useImageUpload();
  const {
    generateMutation,
    latestGeneration,
    setLatestGeneration,
    handleGenerate: handleGenerateHook,
  } = useGenerate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerateHook({ prompt, style, imageUrl: imageUrl || undefined });
  };

  const handleRestore = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style || STYLES[0].value);
    if (generation.imageUrl) {
      setImageUrl(generation.imageUrl);
      setImagePreview(generation.imageUrl);
    }
    // Clear latest generation when restoring from history
    setLatestGeneration(null);
    toast.success("Generation restored to form");
  };

  const handleClearForm = () => {
    setPrompt("");
    setStyle(STYLES[0].value);
    clearImage();
    setLatestGeneration(null);
  };

  return (
    <div className="min-h-screen bg-white grid-bg">
      <Navbar />

      {/* Server Connection Status */}
      {historyError && !isLoadingHistory ? (
        <div className="bg-yellow-300 border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-black flex-shrink-0"
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
              <p className="text-sm text-black font-semibold">
                Cannot connect to backend server. Make sure the server is
                running on{" "}
                <code className="px-2 py-0.5 bg-white border-2 border-black font-mono text-xs">
                  http://localhost:3000
                </code>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
            AI Fashion Studio
          </h1>
          <p className="text-lg text-zinc-700 max-w-2xl">
            Create stunning fashion model images with AI. Upload a reference
            image or describe your vision.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main generation form */}
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-black tracking-tight">
                Create Generation
              </h2>
              <button
                type="button"
                onClick={handleClearForm}
                className="text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
              >
                Clear Form
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <ImageUpload
                onImageSelect={(file, preview) => {
                  setImagePreview(preview);
                  upload(file);
                }}
                preview={imagePreview}
              />

              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-semibold text-black mb-2"
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
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="style"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Style
                </label>
                <select
                  id="style"
                  name="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors bg-white"
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
                  disabled={generateMutation.isPending || isUploading}
                  className="flex-1 px-8 py-4 font-semibold text-base text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
              </div>

              {generateMutation.isError && !generateMutation.isPending && (
                <div className="bg-yellow-300 border-2 border-black p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">
                      Generation failed. Please try again.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        generateMutation.mutate({
                          prompt,
                          style,
                          imageUrl: imageUrl || undefined,
                        })
                      }
                      className="text-sm font-semibold text-black hover:underline"
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
            <div className="bg-green-500 border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-black tracking-tight">
                  ✨ Latest Generation
                </h3>
                <button
                  onClick={() => setLatestGeneration(null)}
                  className="text-black hover:opacity-70 font-bold"
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
                    src={latestGeneration.imageUrl}
                    alt={latestGeneration.prompt}
                    className="w-full border-2 border-black"
                  />
                  <div className="text-sm text-black bg-white border-2 border-black p-4">
                    <p className="font-semibold mb-1">Prompt:</p>
                    <p className="italic">{latestGeneration.prompt}</p>
                  </div>
                  <div className="text-sm font-semibold text-black bg-white border-2 border-black px-4 py-2 inline-block">
                    Style: {latestGeneration.style}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-black font-semibold">
                  <p>Generation completed but no image was created.</p>
                </div>
              )}
            </div>
          )}

          {/* Recent Generations History */}
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <GenerationHistory
              generations={generations}
              isLoading={isLoadingHistory}
              onRestore={handleRestore}
              onView={(generation) => setSelectedGeneration(generation)}
            />
          </div>
        </div>
      </main>

      {/* Generation Modal */}
      <GenerationModal
        generation={selectedGeneration}
        onClose={() => setSelectedGeneration(null)}
        onRestore={(generation) => {
          handleRestore(generation);
          setSelectedGeneration(null);
        }}
      />
    </div>
  );
}
